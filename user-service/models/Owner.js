

const express = require("express")
const { Timestamp } = require("mongodb")
const mongoose = require("mongoose")

const ownerSchema =new mongoose.Schema({
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
        type:String,
        required:true
    }
}, {timestamps:true})

exports.Owner = mongoose.model("owner", ownerSchema)