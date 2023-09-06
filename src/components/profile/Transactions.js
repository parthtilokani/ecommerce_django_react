import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";

const Transactions = () => {
  const axiosPrivate = useAxiosPrivate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 5;
  const [totalData, setTotalData] = useState(0);

  const [fetchedQueries, setFetchedQueries] = useState(false);
  const { data: results, refetch } = useQuery({
    queryKey: ["my_credits_history"],
    queryFn: async () => {
      const { data } = await axiosPrivate.get(
        "/user/user/get_current_user_credits_history",
        {
          params: {
            page: currentPage,
            page_size: itemPerPage,
          },
        }
      );
      setTotalData(data?.count || 0);
      setFetchedQueries(() => true);
      return data?.results || [];
    },
    enabled: !fetchedQueries[0],
  });

  useEffect(() => {
    refetch();
  }, [itemPerPage, currentPage, refetch]);

  return (
    <div className='transactions mb-5'>
      <div className='mb-2 h5 fw-bold mx-3'>Transactions</div>

      <div className='mx-3'>
        <table className='table'>
          <thead>
            <tr>
              <th className='py-md-3'>Date</th>
              <th className='py-md-3'>Action</th>
              <th className='py-md-3'>Credits</th>
            </tr>
          </thead>
          <tbody>
            {results && results.length > 0 ? (
              results?.map((e) => (
                <tr key={e.id}>
                  <td className='py-md-3'>
                    {e?.created_on &&
                      new Date(e?.created_on).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                  </td>
                  <td className='py-md-3'>{e?.description}</td>
                  <td className='py-md-3'>
                    {e?.no_of_credits > 0
                      ? "+" + e?.no_of_credits
                      : e?.no_of_credits}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className='text-center fw-bold py-md-3'>
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className='row'>
          <div className='col-sm-12 col-md-6'>
            <div
              className='dataTables_info'
              id='datatable_info'
              role='status'
              aria-live='polite'>
              Showing{" "}
              {results && results?.length > 0
                ? currentPage * itemPerPage - itemPerPage + 1
                : 0}{" "}
              to {Math.min(currentPage * itemPerPage, totalData)} of {totalData}{" "}
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
    </div>
  );
};

export default Transactions;
