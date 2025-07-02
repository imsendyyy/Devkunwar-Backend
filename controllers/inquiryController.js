const Inquiry = require("../models/Inquiry");
const sendEmail = require("../utils/email")

exports.sendInquiry = async (req, res) => {
        try {
                const { name, email, phone, message } = req.body;

                const newInquiry = new Inquiry({ name, email, phone, message });
                await newInquiry.save();

                // Send email to admin
                await sendEmail({
                        subject: `New Inquiry from ${name}`,
                        to: process.env.ADMIN_EMAIL,
                        html: `
                        <h3>New Inquiry Received</h3>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
                        <p><strong>Message:</strong><br/>${message}</p>
                        `
                });

                res.status(201).json({ message: 'Inquiry sent successfully!' });
        } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Server Error' });
        }
}

exports.getAllInquiry = async(req, res) => {
        try {
                const inquirys = await Inquiry.find();
                res.status(200).json(inquirys)
        } catch (error) {
                res.status(500).json({ error: 'Server error' });
        }
}