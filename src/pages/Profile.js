import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

//css
import "../styles/css/profile.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import { Link, useNavigate } from "react-router-dom";
import { URI } from "../utils/API.js";
import AdCardSkeleton from "../components/skeletons/AdCardSkeleton.js";
import EditProfile from "../components/profile/EditProfile.js";
import ChangePassword from "../components/profile/ChangePassword.js";
import NoAdsCard from "../components/profile/NoAdsCard.js";
import useAuth from "../hooks/useAuth.js";

const Profile = () => {
  const { setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [editModel, setEditModel] = useState(false);
  const [changePasswordModel, setChangePasswordModel] = useState(false);
  const [deleteModel, setDeleteModel] = useState(0);
  const [deleteUserModel, setDeleteUserModel] = useState(false);
  const [password, setPassword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(8);
  const [totalData, setTotalData] = useState(0);

  const [fetchedQueries, setFetchedQueries] = useState([false, false]);
  const { data: userData, refetch: refetchUser } = useQuery({
    queryKey: ["my_data"],
    queryFn: async () => {
      const { data } = await axiosPrivate.get("/user/user/get_current_user");
      setFetchedQueries((prev) => {
        prev[0] = true;
        return [...prev];
      });
      return data;
    },
    enabled: !fetchedQueries[0],
  });
  const {
    data: myAds,
    refetch,
    isLoading: isLoadingAds,
  } = useQuery({
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
        prev[1] = true;
        return [...prev];
      });
      return data || [];
    },
    enabled: !fetchedQueries[1],
  });

  const { mutate: deleteAd, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => axiosPrivate.delete(`/ads/ads/${id}`),
    onSuccess: () => {
      setDeleteModel(0);
      toast.success("Ad post deleted!");
      refetch();
    },
    onError: () => toast.error("Something went wrong! Retry"),
  });

  const { mutate: deleteUser, isLoading: isDeletingUser } = useMutation({
    mutationFn: () =>
      axiosPrivate.post(`/user/user/x/delete_user_account`, { password }),
    onSuccess: () => {
      setAuth({});
      setDeleteUserModel(false);
      toast.success("User deleted!");
    },
    onError: () => toast.error("Something went wrong! Retry"),
  });

  useEffect(() => {
    refetch();
  }, [itemPerPage, currentPage, refetch]);

  const handleDelete = () => {
    deleteAd(deleteModel);
  };

  const handleDeleteUser = () => {
    if (!password.trim()) return toast.error("Password is required");
    deleteUser(password);
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
          <div className='w-100'>
            <div
              style={{
                maxWidth: "1200px",
                margin: "auto",
                paddingTop: "100px",
              }}>
              <div className='row text-center fw-bold'>
                <div className='col-lg-6'>
                  <div className='info-card'>Name : {userData?.name}</div>
                </div>
                <div className='col-lg-6'>
                  <div className='info-card'>
                    Username : {userData?.username}
                  </div>
                </div>
                <div className='col-lg-6'>
                  <div className='info-card'>Email : {userData?.email}</div>
                </div>
                <div className='col-lg-6'>
                  <div className='info-card'>
                    Phone No : {userData?.phone_no}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {editModel && (
        <EditProfile
          setEditModel={setEditModel}
          userData={userData}
          refetchUser={refetchUser}
        />
      )}
      {changePasswordModel && (
        <ChangePassword setChangePasswordModel={setChangePasswordModel} />
      )}

      <div id='my-ads'>
        <div className='h3 fw-bold m-3 mb-0'>My Ads :</div>
        <div className='featured-ads-main row mx-auto'>
          {isLoadingAds ? (
            new Array(4).fill(null).map((_, i) => (
              <div key={i} className='col-xl-3 col-lg-4 col-md-6 col-sm-6 p-3'>
                <AdCardSkeleton />
              </div>
            ))
          ) : myAds?.results?.length > 0 ? (
            myAds?.results?.map((ad, i) => (
              <div className='col-xl-3 col-lg-4 col-md-6 col-sm-6 p-3' key={i}>
                <div className='fa-card'>
                  <div
                    className='fa-img-main position-relative'
                    onClick={() => navigate(`/ads/view/${ad?.id}`)}>
                    <img
                      src={
                        ad?.ads_image?.length > 0 &&
                        ad?.ads_image[0] &&
                        ad?.ads_image[0]?.image
                          ? URI + "/" + ad?.ads_image[0].image
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
                      <div className='d-flex align-items-center'>
                        <img src='/assets/svgs/location.svg' alt='' />
                        <span>{ad?.district_name || "No Location"}</span>
                      </div>
                      <div className='h4 fw-bold'>₹ {ad?.price}</div>
                    </div>

                    <div className='d-flex justify-content-end'>
                      <Link to={`/ads/edit/${ad.id}`}>
                        <button className='btn btn-c-secondary me-1'>
                          Edit
                        </button>
                      </Link>
                      <button
                        className='btn btn-danger'
                        onClick={() => setDeleteModel(ad.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NoAdsCard />
          )}
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
        <div className='h3 fw-bold m-3 mb-1'>Price and Package :</div>
        <div className='row mx-auto our-pricing-main justify-content-center'>
          <div className='col-xl-3 col-lg-4 col-md-6'>
            <div className='our-pricing-card mx-auto'>
              <div className='h4'>{userData?.plan_id?.name}</div>
              <div className='h1 pricing'>
                ₹ {userData?.plan_id?.price}
                <span>/Per month</span>
              </div>
              <div className='op-features'>
                {userData?.plan_id?.ads_number_restriction} Regular Ads
              </div>
              <div className='op-features'>
                {userData?.plan_id?.description || "-"}
              </div>
              <div>
                <button>Active</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id='my-settings py-2'>
        <div className='h3 fw-bold m-3 mb-0'>Settings :</div>
        <div className='px-4'>
          <p className='fw-bold p-2'>
            <span className='pointer' onClick={() => setEditModel(true)}>
              Edit Profile
            </span>
          </p>
          <p className='fw-bold p-2'>
            <span
              className='pointer'
              onClick={() => setChangePasswordModel(true)}>
              Change Password
            </span>
          </p>
          <p className='text-danger fw-bold p-2'>
            <span className='pointer' onClick={() => setDeleteUserModel(true)}>
              Delete Account
            </span>
          </p>
          {/* <p className='fw-bold p-2'>
            Notifications :{" "}
            <button className='btn btn-sm btn-dark'>Enabled</button>
          </p>
          <p className='fw-bold p-2'>Logout from all devices</p> */}
        </div>
      </div>

      {/*Delete Model*/}
      {deleteModel !== 0 && (
        <div className='signup-otp-model'>
          <div className='card'>
            <div className='text-center h4 fw-bold'>Delete your ad post ?</div>
            <div className='mt-1 text-center d-flex justify-content-center'>
              <div>
                <button
                  className='btn btn-danger fw-bold me-2'
                  onClick={handleDelete}
                  disabled={isDeleting}>
                  {isDeleting ? "Deleting" : "Delete"}
                </button>
              </div>
              <div>
                <button
                  className='btn fw-bold text-white signup-btn'
                  disabled={isDeleting}
                  onClick={() => setDeleteModel(0)}>
                  Close
                </button>
              </div>
            </div>
            <img
              src='./assets/svgs/close.svg'
              className='close-btn'
              alt=''
              onClick={() => setDeleteModel(0)}
            />
          </div>
        </div>
      )}
      {deleteUserModel && (
        <div className='signup-otp-model'>
          <div className='card'>
            <div className='text-center h4 fw-bold'>Delete your account ?</div>

            <div className='my-2'>
              <input
                type='password'
                id='password'
                placeholder='Password'
                className='form-control'
                style={{ padding: "14px 16px", fontSize: "17px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete='off'
              />
            </div>
            <div className='mt-1 text-center d-flex justify-content-center'>
              <div>
                <button
                  className='btn btn-danger fw-bold me-2'
                  onClick={handleDeleteUser}
                  disabled={isDeletingUser}>
                  {isDeletingUser ? "Deleting" : "Confirm"}
                </button>
              </div>
              <div>
                <button
                  className='btn fw-bold text-white signup-btn'
                  disabled={isDeletingUser}
                  onClick={() => setDeleteUserModel(false)}>
                  Close
                </button>
              </div>
            </div>
            <img
              src='./assets/svgs/close.svg'
              className='close-btn'
              alt=''
              onClick={() => setDeleteUserModel(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
