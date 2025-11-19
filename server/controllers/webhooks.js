import {Webhook} from 'svix';
import User from '../models/User.js'

// API Controller Function to Manage clerk user with database

export const clerkWebhooks = async (req,res)=>{
    try{
         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
         await whook.verify(JSON.stringify(req.body),{
            "svix-id" : req.headers["svix-id"],
            "svix-timestamp" : req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
         })
         const {data,type} = req.body
         
         switch(type){
            case 'user.created': {
                const userData ={
                    _id: data.id,
                    email: data.email_address[0].email_address,
                    name: data.first_name + " " +data.last_name,
                    imageUrl: data.imageUrl
                }
                await User.create(userData)
                res.json({})
                break;
            }
            case 'user.updated':{
        const UserData ={
            _id: data.id,
         email: data.email_addresses[0].email_address,
         name: data.first_name + " " +data.last_name,
         imageUrl: data.imageUrl
        }
        await User.findByIdAndUpdate(data.id, userData)
        res.json({})
        break;

            }
            case ' user.deleted' :{
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }

            default:
                break;
         }
    }
    catch(error){
res.json({success: false, message: error.message})
    }
}



export const stripeWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY;

  if (!WEBHOOK_SECRET) {
    throw new Error("Webhook secret needed!");
  }

  const evt = req.body;
  // console.log(evt);
  switch (evt.type) {
    case "payment_intent.succeeded":
      const paymentIntent = evt.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await Stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await PurchaseModel.findById(purchaseId);
      const userData = await UserModel.findById(purchaseData.userId);
      const courseData = await CourseModel.findById(purchaseData.courseId);

      courseData.enrolledStudents.push(userData._id);
      await courseData.save();
      userData.enrolledCourses.push(courseData._id);
      await userData.save();
      purchaseData.status = "completed";
      await purchaseData.save();

      break;

    case "payment_intent.payment_failed":
      const failedPaymentIntent = evt.data.object;
      const failedPaymentIntentId = failedPaymentIntent.id;

      const failedSession = Stripe.checkout.sessions.list({
        payment_intent: failedPaymentIntentId,
      });

      const { FailedPurchaseId } = failedSession.data[0].metadata;
      const failedPurchaseData = await PurchaseModel.findById(FailedPurchaseId);
      failedPurchaseData.status = "failed";
      failedPurchaseData.save();

      break;

    default:
      console.log(`Unhandled event type ${evt.type}`);
      break;
  }

  res.json({ received: true });
};