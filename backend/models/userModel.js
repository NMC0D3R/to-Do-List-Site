const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [false, "must type username"],
    },
    password: {
      type: String,
      required: [true, "must type password"],
      minLength: [8, "the password must be longer then 8 chars"],
      select: false,
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (el) {
          // Only run this validator if the password field is being modified
          return !this.isModified("password") || this.password === el;
        },
        message: "the password doesn't match",
      },
    },

    email: {
      type: String,
      required: [true, "type email"],
      validate: {
        validator: (val) => validator.isEmail(val),
        message: "email is not valid",
      },
      unique: true,
    },

    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  foreignField: "author",
  localField: "_id",
});
userSchema.pre(/^findOne/, function (next) {
  this.populate("tasks");
  next();
});

//refers to curr doc before saving in the DB

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(15);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;
  }
  next();
});

userSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew)
    this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 5 * 60 * 100;
  return resetToken;
};

userSchema.methods.checkPassword = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
