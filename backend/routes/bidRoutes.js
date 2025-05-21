import express from 'express';
import { placeBid } from '../controllers/bidController.js';

const createBidRouter = (io) => {
  const router = express.Router();
  router.post('/:id/bid', placeBid(io));
  return router;
};

export default createBidRouter;
