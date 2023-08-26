import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import useAuth from "../../hooks/useAuth.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { axiosOpen } from "../../utils/axios.js";

const PackageAndPricing = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [fetchedQueries, setFetchedQueries] = useState([false]);

  const { data: adsPlans } = useQuery({
    queryKey: ["ads_plans"],
    queryFn: async () => {
      const { data } = await axiosOpen.get("/ads_plan/ads_plan/");
      setFetchedQueries((prev) => {
        prev[0] = true;
        return [...prev];
      });
      return typeof data === "object" ? [...data] : [];
    },
    enabled: !fetchedQueries[0],
    initialData: [],
  });

  function buyPackage(plan_id) {
    if (!auth?.accessToken) navigate("/login", { replace: true });
    axiosPrivate
      .post("/ads_plan/pay", { ads_plan_id: plan_id })
      .then((res) => {
        const options = {
          key: res.data?.api_id,
          amount: res.data?.payment?.amount,
          currency: res?.data?.payment?.currency,
          name: "Classified Ads",
          description: "Package and Pricing",
          //  image: mainlogo,
          order_id: res?.data?.payment?.id,
          handler: function (response) {
            onPayment(response);
          },
          theme: {
            color: "#3399cc",
          },
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
        rzp1.on("payment.failed", function (response) {
          //   alert(response.error.code);
          //   alert(response.error.description);
          //   alert(response.error.source);
          //   alert(response.error.step);
          //   alert(response.error.reason);
          //   alert(response.error.metadata.order_id);
          //   alert(response.error.metadata.payment_id);
          // onPayment(
          //   { razorpay_order_id: response.error.metadata.order_id },
          //   false
          // );
        });
      })
      .catch((err) => console.error(err));
  }

  function onPayment(response) {
    axiosPrivate
      .post(`/ads_plan/payment/sucess`, { response })
      .then((res) => {
        toast.success("Plan purchased successfully");
        navigate(`/profile`);
      })
      .catch((err) => toast.error("Payment failed!"));
  }

  return (
    <section id='our-pricing-and-packages'>
      <div className='text-center py-4 mx-1'>
        <div className='h2 fw-bold'>Our Pricing and Packages</div>
      </div>
      <div className='row mx-auto our-pricing-main justify-content-center'>
        {adsPlans?.map((plan, i) => (
          <div className='col-xl-3 col-lg-4 col-md-6' key={i}>
            <div className='our-pricing-card mx-auto'>
              <div className='h4 text-capitalize'>{plan?.name}</div>
              <div className='h1 pricing'>₹ {plan?.price}</div>
              <div className='op-features'>
                {plan?.ads_number_restriction} Ads /per month
              </div>
              <div className='op-features'>{plan?.description || "-"}</div>
              <div>
                <button
                  onClick={() => buyPackage(plan?.id)}
                  disabled={Number(plan.price) === 0}>
                  {Number(plan.price) === 0
                    ? "Active"
                    : auth?.accessToken
                    ? "Purchase"
                    : "Register"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PackageAndPricing;
