import { globalError } from "./middlewares/globalError.js";
import { authRouter } from "./modules/auth/authRoutes.js";
import { governrateRouter } from "./modules/governrates/governrate.routes.js";
import { legendRouter } from "./modules/legends/legends.routes.js";
import { offerRouter } from "./modules/offer/offer.Routers.js";
import { reviewRouter } from "./modules/review/review.Routes.js";
import { tourismPlacesRouter } from "./modules/tourismPlaces/tourismPlaces.routes.js";
import { tripRouter } from "./modules/trip/trip.Routers.js";
import { userRouter } from "./modules/user/userRoutes.js";
import governrateWishListRouter from "./modules/governrateWL/governrateWL.routes.js";
import tourismPlaceWishListRouter from "./modules/tourismPlaceWL/tourismPlaceWL.routes.js";
import legendWishListRouter from "./modules/legendWL/legendWL.routes.js";
import tripWishListRouter from "./modules/tripWL/tripWL.routes.js";
import { myTicketRouter } from "./modules/myTickets/myTickets.routes.js";
import { orderRouter } from "./modules/order/order.routes.js";


export const bootstrap = (app) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/governrates", governrateRouter);
  app.use("/api/v1/tourismPlaces", tourismPlacesRouter);
  app.use("/api/v1/legends", legendRouter);
  app.use("/api/v1/offers", offerRouter);
  app.use("/api/v1/trips", tripRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/order", orderRouter);
  app.use("/api/v1/myTickets", myTicketRouter);
  app.use("/api/v1/governrateWL",governrateWishListRouter)
  app.use("/api/v1/tourismPlaceWL",tourismPlaceWishListRouter)
  app.use("/api/v1/legendWL",legendWishListRouter)
  app.use("/api/v1/tripWL",tripWishListRouter)
  
  app.use("*", (req, res, next) => {
    next(new apiError(`not found endPoint : ${req.originalUrl}`, 404));
  });

  app.use(globalError);
};
