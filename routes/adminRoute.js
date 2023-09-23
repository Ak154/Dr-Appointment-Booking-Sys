const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/userModel')
const Doctor = require('../models/doctorModels')

router.get('/get-all-doctors', authMiddleware, async(req, resp)=>{
    try {
        const doctors = await Doctor.find({});
        resp
          .status(200)
          .send({
            message: 'Doctors fetched successfully',
            success: true,
            data: doctors,
          });
    } catch (error) {
        console.log(error);
        resp
          .status(500)
          .send({
            message: 'Error applying doctor account',
            success: false,
            error,
          });
    }
})

router.get('/get-all-users', authMiddleware, async(req, resp)=>{
    try {
        const users = await User.find({})
        resp
          .status(200)
          .send({
            message: 'User fetched successfully',
            success: true,
            data: users,
          })
    }catch(error){
        console.log(error);
        resp
          .status(500)
          .send({
            message: 'Error applying doctor account',
            success: false,
            error,
          });
    }
});

router.post('/change-doctor-account-status', authMiddleware, async(req, resp)=>{
  try {
    const { doctorId, status, userId} = req.body;
    const doctor = await Doctor.findByIdAndUpdate(doctorId, {
      status,
    });
      const user = await User.findOne({_id: doctor.userId});
      const unseenNotifications = user.unseenNotifications
      unseenNotifications.push({
        type: "new-doctor-request-changed",
        message: `Your doctor account has been ${status}`,
        onClickPath : '/notifications'
      });
      user.isDoctor = status === 'approved' ? true : false;
      await user.save();
      resp
        .status(200)
        .send({
          message: 'Doctor status updated successfully',
          success: true,
          data: doctor,
        })
  }catch(error){
      console.log(error);
      resp
        .status(500)
        .send({
          message: 'Error applying doctor account',
          success: false,
          error,
        });
  }
});

module.exports = router;