const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    password: { type: String, required: true },
    virtualBalance: { type: Number, default: 100000 }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual usertype mapped to role for frontend compatibility
userSchema.virtual('usertype')
  .get(function() { return this.role; })
  .set(function(val) { this.role = val; });

// Virtual balance mapped to virtualBalance for frontend compatibility
userSchema.virtual('balance')
  .get(function() { return this.virtualBalance; })
  .set(function(val) { this.virtualBalance = val; });

module.exports = mongoose.model('users', userSchema);
