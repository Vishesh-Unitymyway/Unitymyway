const mongoose = require("mongoose");
const validate = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
    },
    email: {
      type: String,
      required: [true, "A user must have a email_Id"],
      unique: [true, "Email_ID already exists"],
      lowercase: true,
      validate: {
        validator: validate.default.isEmail,
        message: "Please enter a valid email ID !",
      },
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please enter a password !"],
      max: [5, "Password should atleast 8 digit !"],
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password !"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Password are not the same",
      },
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = async function (
  userPassword,
  candidatePassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
