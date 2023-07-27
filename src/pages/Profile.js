import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

//css
import "../styles/css/profile.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import { Link, useNavigate } from "react-router-dom";
import { URI } from "../utils/API.js";

const DeleteAdPostToast = ({ closeToast, deleteAd }) => (
  <div>
    <p>Delete Ad?</p>
    <button className='btn btn-danger btn-sm mx-1' onClick={deleteAd}>
      Sure
    </button>
    <button onClick={closeToast} className='btn btn-info btn-sm'>
      Close
    </button>
  </div>
);

const Profile = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(8);
  const [totalData, setTotalData] = useState(0);

  const [fetchedQueries, setFetchedQueries] = useState([false, false]);
  const { data: myAds, refetch } = useQuery({
    queryKey: ["my_ads"],
    queryFn: async () => {
      const { data } = await axiosPrivate.get("/ads/ads/get_current_user_ads", {
        params: {
          page: currentPage,
          page_size: itemPerPage,
        },
      });
      setTotalData(data?.count || 0);
      setFetchedQueries((prev) => {
        prev[0] = true;
        return [...prev];
      });
      return data || [];
    },
    enabled: !fetchedQueries[0],
  });

  const { mutate: deleteAd } = useMutation({
    mutationFn: (id) => axiosPrivate.delete(`/ads/ads/${id}`),
    onSuccess: () => {
      toast.success("Ad post deleted!");
      refetch();
    },
    onError: () => toast.error("Something went wrong! Retry"),
  });

  useEffect(() => {
    refetch();
  }, [itemPerPage, currentPage, refetch]);

  const handleDelete = (idx) => {
    toast(<DeleteAdPostToast deleteAd={() => deleteAd(idx)} />);
  };

  return (
    <div id='profile'>
      <div id='profile-hero' className='p-3'>
        <div>
          <img
            className='profile-img'
            src='./assets/svgs/profile-ph.svg'
            alt='Profile'
          />
        </div>
      </div>

      <div id='my-ads'>
        <div className='h3 fw-bold m-3 mb-0'>My Ads :</div>
        <div className='featured-ads-main row mx-auto'>
          {myAds?.results?.map((ad, i) => (
            <div className='col-xl-3 col-lg-4 col-md-6 col-sm-6 p-3' key={i}>
              <div className='fa-card'>
                <div
                  className='fa-img-main position-relative'
                  onClick={() => navigate(`/ads/view/${ad?.id}`)}>
                  <img
                    src={
                      ad?.images?.length > 0 &&
                      ad?.images[0] &&
                      ad?.images[0]?.image
                        ? URI + "/" + ad?.images[0].image
                        : "https://www.radiustheme.com/demo/wordpress/publicdemo/classima/wp-content/themes/classima/assets/img/noimage-listing-thumb.jpg"
                    }
                    alt=''
                  />
                  <div className='fa-img-overlay'></div>
                </div>
                <div className='fa-card-body'>
                  <div onClick={() => navigate(`/ads/view/${ad?.id}`)}>
                    <div className='h6 fw-bold'>{ad?.ad_title}</div>
                    <div className='d-flex align-items-center'>
                      <img src='/assets/svgs/time.svg' alt='' />
                      <span>
                        {ad?.posted_on &&
                          new Date(ad?.posted_on).toLocaleString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "numeric",
                            hour12: true,
                          })}
                      </span>
                    </div>
                    {/* <div className='d-flex align-items-center'>
                    <img src='/assets/svgs/profile.svg' alt='' />
                    <span>Yakuza</span>
                  </div> */}
                    <div className='d-flex align-items-center'>
                      <img src='/assets/svgs/location.svg' alt='' />
                      <span>Denmark</span>
                    </div>
                    <div className='h4 fw-bold'>₹ {ad?.price}</div>
                  </div>

                  <div className='d-flex justify-content-end'>
                    <Link to={`/ads/edit/${ad.id}`}>
                      <button className='btn btn-c-secondary me-1'>Edit</button>
                    </Link>
                    <button
                      className='btn btn-danger'
                      onClick={() => handleDelete(ad.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='row mt-20 m-1'>
          <div className='col-sm-12 col-md-6 mb-20'>
            <div
              className='dataTables_info'
              id='datatable_info'
              role='status'
              aria-live='polite'>
              Showing {currentPage * itemPerPage - itemPerPage + 1} to{" "}
              {Math.min(currentPage * itemPerPage, totalData)} of {totalData}{" "}
              entries
            </div>
          </div>

          <div className='col-sm-12 col-md-6'>
            <div className='d-flex'>
              <ul className='pagination ms-auto'>
                <li
                  className={
                    currentPage === 1
                      ? "paginate_button page-item previous disabled"
                      : "paginate_button page-item previous"
                  }>
                  <span
                    className='page-link text-dark'
                    style={{ cursor: "pointer" }}
                    onClick={() => setCurrentPage((prev) => prev - 1)}>
                    Previous
                  </span>
                </li>

                {!(currentPage - 1 < 1) && (
                  <li className='paginate_button page-item'>
                    <span
                      className='page-link text-dark'
                      style={{ cursor: "pointer" }}
                      onClick={(e) => setCurrentPage((prev) => prev - 1)}>
                      {currentPage - 1}
                    </span>
                  </li>
                )}

                <li className='paginate_button page-item active'>
                  <span
                    className='page-link bg-secondary'
                    style={{ cursor: "pointer" }}>
                    {currentPage}
                  </span>
                </li>

                {!(
                  (currentPage + 1) * itemPerPage - itemPerPage >
                  totalData - 1
                ) && (
                  <li className='paginate_button page-item '>
                    <span
                      className='page-link text-dark'
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setCurrentPage((prev) => prev + 1);
                      }}>
                      {currentPage + 1}
                    </span>
                  </li>
                )}

                <li
                  className={
                    !(
                      (currentPage + 1) * itemPerPage - itemPerPage >
                      totalData - 1
                    )
                      ? "paginate_button page-item next"
                      : "paginate_button page-item next disabled"
                  }>
                  <span
                    className='page-link text-dark'
                    style={{ cursor: "pointer" }}
                    onClick={() => setCurrentPage((prev) => prev + 1)}>
                    Next
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div id='price-and-packages'>
        <div className='h3 fw-bold m-3 mb-1'>Price and Packages :</div>
        <div className='row mx-auto our-pricing-main'>
          {new Array(4).fill(null).map((_, i) => (
            <div className='col-xl-3 col-lg-4 col-md-6' key={i}>
              <div className='our-pricing-card mx-auto'>
                <div className='h4'>Free</div>
                <div className='h1 pricing'>
                  ₹ 0<span>/Per month</span>
                </div>
                <div className='op-features'>3 Regular Ads</div>
                <div className='op-features'>No Featured Ads</div>
                <div className='op-features'>No Top Ads</div>
                <div className='op-features'>No Ads will be bumped up</div>
                <div className='op-features'>Limited Support</div>
                <div>
                  <button>Register</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id='my-settings py-2'>
        <div className='h3 fw-bold m-3 mb-0'>Settings :</div>
        <div className='px-4'>
          <p className='text-danger fw-bold p-2'>Delete Account</p>
          <p className='fw-bold p-2'>
            Notifications :{" "}
            <button className='btn btn-sm btn-dark'>Enabled</button>
          </p>
          <p className='fw-bold p-2'>Logout from all devices</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
