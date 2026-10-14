

const express = require("express")
const { Timestamp } = require("mongodb")
const mongoose = require("mongoose")

const ownerSchema =new mongoose({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true

    },

    password:{
        type:true,
        required:true
    }
}, {Timestamp:true})

exports.owner = mongoose.model('owner', ownerSchema)