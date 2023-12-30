const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')
const Patient = require('../../models/Patient')


// @route    Post api/posts
// @desc     Create post
// @access   Private
router.post('/', [auth, [
    check('firstname', 'Firstname is required').not().isEmpty(),
    check('middlename', 'Middlename is required').not().isEmpty(),
    check('lastname', 'From Lastname is required').not().isEmpty(),
    check('gender', 'From gender is required').not().isEmpty()
 ]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() })
    }
    

    try {
        
        const { firstname, middlename, lastname, gender, age, nurse} = req.body;

         // See if user exists
        let patient = await Patient.findOne({ firstname, middlename, lastname })
        
        if(patient) {
            return res.status(400).json({ errors: [{ msg: 'Patient already exists'}]})
        }
 
        patient = new Patient({
             firstname,
             middlename,
             lastname,
             gender,
             age,
             nurse
        })

      //   this will save the array of data
      //   if(skills) {
      //    profileFields.skills = skills.split(',').map(skill => skill.trim())
      //   }
 
        await patient.save()
        res.json(patient);

    } catch (err) {
       console.error(err.message);
       res.status(500).send('Server Error')
       
    }


})


router.get('/', auth, async (req, res) => {
    try {
       const patients = await Patient.find();
       res.json(patients);
    } catch (err) {
       console.error(err.message) 
       res.status(500).send('Server Error')
    }
 });

 router.get('/:patient_id', auth, async (req, res) => {
    try {
       const patient = await Patient.find({ _id: req.params.patient_id });
       console.log(req.params.patient_id)
       console.log(patient);
       if(!patient) res.status(400).json({ msg: 'There is no profile for this patient' })
       res.json(patient);
    } catch (err) {
       if(err.kind == 'ObjectId') {
          return res.status(400).json({ msg: 'Patient not found' })
       }
       console.error(err.message)
       res.status(500).send('Server Error')
    }
 });



router.put('/illness', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
 ]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() })
    }

    const { title, company, location, from, to, current, description} = req.body;
    
    const newExp = {
       title,
       company,
       location,
       from,
       to,
       current,
       description
    }

    try {
       const profile = await Profile.findOne({ user: req.user.id })
       profile.experience.unshift(newExp);

       await profile.save();

       res.json(profile);
    } catch (err) {
       console.error(err.message);
       res.status(500).send('Server Error')
       
    }


})

module.exports = router;
