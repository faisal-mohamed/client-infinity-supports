"use client";

import React from "react";
import SADeliverySupportsDynamic from "./SADeliverySupportsDynamic";

/**
 * Wrapper component for SA Delivery of Supports view mode
 * Uses dynamic content flow with height-based pagination
 */
const SADeliverySupportsView: React.FC<any> = (props) => {
  return <SADeliverySupportsDynamic {...props} />;
};

export default SADeliverySupportsView;

