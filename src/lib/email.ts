import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function sendOrderConfirmation(email: string, name: string, orderId: string, amount: string) {
    try {
        await transporter.sendMail({
            from: `"Aditya Art Studio" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: `Order Confirmation - #${orderId}`,
            html: `
        <h2>Thank you for your order, ${name}!</h2>
        <p>We've received your request for <strong>${orderId}</strong>. To begin processing your artwork, please proceed with the 50% advance payment.</p>
        <p><strong>Order Total:</strong> ₹${amount}</p>
        <p><strong>Advance Amount Due:</strong> ₹${(Number(amount) / 2).toFixed(2)}</p>
        <p>Complete Advance Payment here: <a href="${process.env.NEXT_PUBLIC_APP_URL}/payment/${orderId}">${process.env.NEXT_PUBLIC_APP_URL}/payment/${orderId}</a></p>
        <p>Track your order status live at: <a href="${process.env.NEXT_PUBLIC_APP_URL}/track/${orderId}">${process.env.NEXT_PUBLIC_APP_URL}/track/${orderId}</a></p>
        <br />
        <p>Best Regards,</p>
        <p>Aditya Vishwakarma</p>
      `,
        });
    } catch (err) {
        console.error('Email failed to send', err);
    }
}

export async function sendAdminNotification(type: string, details: string) {
    try {
        await transporter.sendMail({
            from: `"System Notifications" <${process.env.ADMIN_EMAIL}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `New Action: ${type}`,
            html: `
        <h3>Admin System Alert</h3>
        <p>You have a new action regarding: <b>${type}</b>.</p>
        <pre>${details}</pre>
        <p>Login to your admin panel to manage it.</p>
      `,
        });
    } catch (err) {
        console.error('Admin email failed', err);
    }
}

export async function sendPaymentVerificationEmail(email: string, name: string, orderId: string, type: string) {
    try {
        await transporter.sendMail({
            from: `"Aditya Art Studio" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: `Payment Verification Pending - #${orderId}`,
            html: `
        <h2>Hello ${name},</h2>
        <p>We have received the payment screenshot for your ${type} (${orderId}).</p>
        <p>Our team will manually review and verify the transaction shortly. Once verified, you will receive another email confirming the exact start of your order timeline.</p>
        <p>Track your order status live at: <a href="${process.env.NEXT_PUBLIC_APP_URL}/track/${orderId}">${process.env.NEXT_PUBLIC_APP_URL}/track/${orderId}</a></p>
        <br />
        <p>Best Regards,</p>
        <p>Aditya Vishwakarma</p>
      `,
        });
    } catch (err) {
        console.error('Verification email failed', err);
    }
}

export async function sendPaymentApprovedEmail(email: string, name: string, orderId: string) {
    try {
        await transporter.sendMail({
            from: `"Aditya Art Studio" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: `Payment Verified ✅ - #${orderId}`,
            html: `
        <h2>Great News, ${name}!</h2>
        <p>Your payment for order <strong>${orderId}</strong> has been successfully verified.</p>
        <p>The status of your order has now been updated to <strong>In Progress</strong>.</p>
        <p>Check the latest updates here: <a href="${process.env.NEXT_PUBLIC_APP_URL}/track/${orderId}">${process.env.NEXT_PUBLIC_APP_URL}/track/${orderId}</a></p>
        <br />
        <p>Best Regards,</p>
        <p>Aditya Vishwakarma</p>
      `,
        });
    } catch (err) {
        console.error('Approval email failed', err);
    }
}

export async function sendPaymentRejectedEmail(email: string, name: string, orderId: string, reason?: string) {
    try {
        await transporter.sendMail({
            from: `"Aditya Art Studio" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: `Payment Rejected / Action Required ❌ - #${orderId}`,
            html: `
        <h2>Hello ${name},</h2>
        <p>Unfortunately, we could not verify the payment screenshot you uploaded for order <strong>${orderId}</strong>.</p>
        <p><strong>Reason:</strong> ${reason || 'The transaction UTR was invalid or the amount did not match.'}</p>
        <p>Please reply to this email or re-upload a clear screenshot using your UPI app history to proceed with your order.</p>
        <p>Upload a new screenshot here: <a href="${process.env.NEXT_PUBLIC_APP_URL}/payment/${orderId}">${process.env.NEXT_PUBLIC_APP_URL}/payment/${orderId}</a></p>
        <br />
        <p>Best Regards,</p>
        <p>Aditya Art Studio Support</p>
      `,
        });
    } catch (err) {
        console.error('Rejection email failed', err);
    }
}

export async function sendNewsletterWelcomeEmail(email: string) {
    try {
        await transporter.sendMail({
            from: `"Aditya Art Studio" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: `Welcome to the Studio Note 🎨`,
            html: `
        <h2>Welcome to the inner circle!</h2>
        <p>Thank you for subscribing to the Aditya Art Studio newsletter.</p>
        <p>You'll now be the first to know about:</p>
        <ul>
            <li>Exclusive limited edition drops</li>
            <li>New original artwork available in the shop</li>
            <li>Behind-the-scenes glimpses into my graphite and charcoal process</li>
            <li>Commission openings before they are publicly announced</li>
        </ul>
        <br />
        <p>I usually send an update only when I have something truly exciting to share. No spam, I promise.</p>
        <br />
        <p>Best Regards,</p>
        <p>Aditya Vishwakarma</p>
      `,
        });
    } catch (err) {
        console.error('Welcome email failed', err);
    }
}

export async function sendCommissionQuote(email: string, name: string, orderId: string, total: string, advance: string, shippingHtml: string = '') {
    try {
        await transporter.sendMail({
            from: `"Aditya Art Studio" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: `Commission Quote Ready 🎨 - #${orderId}`,
            html: `
        <h2>Hello ${name},</h2>
        <p>Your commission request <strong>${orderId}</strong> has been reviewed. Here is the official quote:</p>
        <ul>
            <li><strong>Final Total:</strong> ₹${total}</li>
            <li><strong>Advance Required (to begin):</strong> ₹${advance}</li>
            <li><strong>Remaining Due (on completion):</strong> ₹${(Number(total) - Number(advance)).toString()}</li>
        </ul>
        ${shippingHtml}
        <p>Please pay the <strong>Advance Amount</strong> using the payment page to secure your slot and begin the drafting process.</p>
        <p>Pay Advance here: <a href="${process.env.NEXT_PUBLIC_APP_URL}/payment/${orderId}">${process.env.NEXT_PUBLIC_APP_URL}/payment/${orderId}</a></p>
        <br />
        <p>Best Regards,</p>
        <p>Aditya Vishwakarma</p>
      `,
        });
    } catch (err) {
        console.error('Quote email failed', err);
    }
}

export async function sendArtworkCompleted(email: string, name: string, orderId: string, remaining: string, shippingHtml: string = '') {
    try {
        await transporter.sendMail({
            from: `"Aditya Art Studio" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: `Your Artwork is Ready! 🎨✨ - #${orderId}`,
            html: `
        <h2>Exciting News ${name}!</h2>
        <p>Your commissioned artwork <strong>${orderId}</strong> is fully completed and looking beautiful.</p>
        <p>To proceed with high-resolution delivery or shipping, please complete the remaining payment.</p>
        <p><strong>Remaining Balance:</strong> ₹${remaining}</p>
        ${shippingHtml}
        <p>Complete Payment here: <a href="${process.env.NEXT_PUBLIC_APP_URL}/payment/${orderId}">${process.env.NEXT_PUBLIC_APP_URL}/payment/${orderId}</a></p>
        <br />
        <p>Once the final payment is verified, we will share the final files/shipment details.</p>
        <br />
        <p>Best Regards,</p>
        <p>Aditya Vishwakarma</p>
      `,
        });
    } catch (err) {
        console.error('Completion email failed', err);
    }
}

export async function sendFinalPaymentVerified(email: string, name: string, orderId: string) {
    try {
        await transporter.sendMail({
            from: `"Aditya Art Studio" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: `Final Payment Received! ✅ - #${orderId}`,
            html: `
        <h2>Payment Fully Received, ${name}!</h2>
        <p>Your final payment for order <strong>${orderId}</strong> has been successfully verified.</p>
        <p>Thank you for your trust and collaboration. We are now preparing your artwork for final delivery/shipping.</p>
        <p>You can see the final status here: <a href="${process.env.NEXT_PUBLIC_APP_URL}/track/${orderId}">${process.env.NEXT_PUBLIC_APP_URL}/track/${orderId}</a></p>
        <br />
        <p>Best Regards,</p>
        <p>Aditya Vishwakarma</p>
      `,
        });
    } catch (err) {
        console.error('Final verification email failed', err);
    }
}

export async function sendOrderShippedEmail(email: string, name: string, orderId: string, courier: string, trackingNo: string) {
    try {
        await transporter.sendMail({
            from: `"Aditya Art Studio" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: `Your Art is on its way! 🚚 - #${orderId}`,
            html: `
        <h2>Hi ${name}, your order has been shipped!</h2>
        <p>Your artwork for order <strong>${orderId}</strong> is now with our courier partner.</p>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Courier:</strong> ${courier}</p>
            <p><strong>Tracking Number:</strong> ${trackingNo}</p>
        </div>
        <p>You can monitor progress on our tracker: <a href="${process.env.NEXT_PUBLIC_APP_URL}/track/${orderId}">${process.env.NEXT_PUBLIC_APP_URL}/track/${orderId}</a></p>
        <br />
        <p>Best Regards,</p>
        <p>Aditya Vishwakarma</p>
      `,
        });
    } catch (err) {
        console.error('Shipment email failed', err);
    }
}

export async function sendOrderDeliveredEmail(email: string, name: string, orderId: string) {
    try {
        await transporter.sendMail({
            from: `"Aditya Art Studio" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: `Artwork Delivered! 🏠🎨 - #${orderId}`,
            html: `
        <h2>Hello ${name}, your art has arrived!</h2>
        <p>Our records show that your order <strong>${orderId}</strong> has been successfully delivered.</p>
        <p>Please inspect your artwork. If everything is perfect, we kindly request you to complete the remaining 50% payment stage to finalize the order.</p>
        <p>Complete your final payment here: <a href="${process.env.NEXT_PUBLIC_APP_URL}/payment/${orderId}">${process.env.NEXT_PUBLIC_APP_URL}/payment/${orderId}</a></p>
        <br />
        <p>Thank you for choosing Aditya Art Studio.</p>
        <p>Best Regards,</p>
        <p>Aditya Vishwakarma</p>
      `,
        });
    } catch (err) {
        console.error('Delivered email failed', err);
    }
}
