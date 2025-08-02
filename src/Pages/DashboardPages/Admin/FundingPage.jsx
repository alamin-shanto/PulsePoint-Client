import { useEffect, useState, useContext } from "react";
import ReactDOM from "react-dom";
import FocusTrap from "focus-trap-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import AuthContext from "../../../Context/AuthContext";

const stripePromise = loadStripe(
  "pk_test_51Rr6BJDeWWmAwpeJJVTLms0U5c59oKGDQxOPiTShssA5fefSW8njltZpcCRV65zKwGrMx2G7cn7RimbvEdSHBNpn00ATblFJxU"
);

const PAGE_SIZE = 10;

const CheckoutForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !amount) return;

    setProcessing(true);

    try {
      const res = await axiosSecure.post("/create-payment-intent", {
        amount: Math.round(parseFloat(amount)),
      });

      const clientSecret = res.data.clientSecret;
      if (!clientSecret) {
        toast.error("Failed to get client secret.");
        setProcessing(false);
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.name || "Anonymous",
            email: user?.email || "Unknown",
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message || "Payment error.");
      } else if (result.paymentIntent.status === "succeeded") {
        await axiosSecure.post("/fundings", {
          userId: user._id || user.uid,
          userName: user.name,
          email: user.email,
          amount: parseFloat(amount),
          date: new Date().toISOString(),
        });

        toast.success("Thank you for your fund!");
        onSuccess();
      } else {
        toast.error("Payment did not succeed.");
      }
    } catch (err) {
      toast.error("Payment failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#1a202c",
              "::placeholder": { color: "#a0aec0" },
              fontFamily: '"Inter", sans-serif',
              padding: "12px 14px",
            },
            invalid: { color: "#e53e3e" },
          },
          hidePostalCode: true,
        }}
        className="border border-gray-300 rounded-lg p-4 shadow-sm focus-within:ring-2 focus-within:ring-red-500 transition"
      />
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          aria-label="Cancel payment"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:brightness-110 disabled:opacity-60 transition"
          aria-label={`Pay $${amount}`}
        >
          {processing ? "Processing..." : `Pay $${amount}`}
        </button>
      </div>
    </form>
  );
};

const Modal = ({ children, onClose }) => {
  const modalRoot = document.getElementById("modal-root");

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <FocusTrap
        focusTrapOptions={{
          fallbackFocus: "#modal-container",
        }}
      >
        <div
          id="modal-container"
          className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative"
        >
          {children}
        </div>
      </FocusTrap>
    </div>,
    modalRoot
  );
};

const FundingPage = () => {
  const axiosSecure = useAxiosSecure();
  useContext(AuthContext); // to avoid unused warning
  const [fundings, setFundings] = useState([]);
  const [totalFunds, setTotalFunds] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingTotal, setLoadingTotal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [amountToFund, setAmountToFund] = useState("");
  const [refreshFundings, setRefreshFundings] = useState(false);

  // Fetch fundings with pagination
  useEffect(() => {
    const fetchFundings = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get(
          `/fundings?page=${currentPage}&limit=${PAGE_SIZE}`
        );
        setFundings(res.data.fundings || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        toast.error("Failed to load fundings: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFundings();
  }, [currentPage, axiosSecure, refreshFundings]);

  // Fetch total funds (sum) separately
  useEffect(() => {
    const fetchTotalFunds = async () => {
      setLoadingTotal(true);
      try {
        const res = await axiosSecure.get("/fundings/total"); // Assuming your backend provides this
        setTotalFunds(res.data.totalAmount || 0);
      } catch (err) {
        toast.error("Failed to load total funds: " + err.message);
      } finally {
        setLoadingTotal(false);
      }
    };
    fetchTotalFunds();
  }, [refreshFundings, axiosSecure]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header with total funds */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6">
        <h1 className="text-4xl font-extrabold text-red-700 tracking-wide drop-shadow-sm">
          Funding Dashboard
        </h1>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-700">
            Total Funds Raised:
          </p>
          <p
            className={`text-3xl font-extrabold text-red-700 ${
              loadingTotal ? "animate-pulse" : ""
            }`}
            aria-live="polite"
          >
            {loadingTotal ? "Loading..." : `$${totalFunds.toFixed(2)}`}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200"
          aria-label="Open funding modal"
        >
          Give Fund
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-5 right-6 text-gray-400 hover:text-red-600 text-3xl font-bold"
            aria-label="Close modal"
          >
            &times;
          </button>
          <h2
            id="modal-title"
            className="text-2xl font-extrabold mb-6 text-center text-red-700 tracking-tight"
          >
            Enter Amount to Fund
          </h2>
          <input
            type="number"
            value={amountToFund}
            min="1"
            onChange={(e) => setAmountToFund(e.target.value)}
            placeholder="Amount in USD"
            className="w-full border border-gray-300 rounded-lg px-5 py-4 mb-6 focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-transparent transition"
            autoFocus
            aria-label="Enter funding amount in USD"
          />
          {amountToFund && +amountToFund > 0 && (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                amount={amountToFund}
                onSuccess={() => {
                  setShowModal(false);
                  setAmountToFund("");
                  setCurrentPage(1);
                  setRefreshFundings((prev) => !prev);
                }}
                onCancel={() => setShowModal(false)}
              />
            </Elements>
          )}
        </Modal>
      )}

      {/* Loading & No Data */}
      {loading ? (
        <p className="text-center py-16 text-red-600 font-semibold animate-pulse">
          Loading fundings...
        </p>
      ) : fundings.length === 0 ? (
        <p className="text-center py-16 text-gray-500 text-lg">
          No funding records found.
        </p>
      ) : (
        <>
          {/* Table for medium+ screens */}
          <div className="overflow-x-auto rounded-3xl shadow-xl border border-red-200 hidden sm:block">
            <table className="w-full min-w-[480px] text-center border-collapse">
              <thead className="bg-red-50">
                <tr>
                  {["Name", "Amount (USD)", "Date"].map((title) => (
                    <th
                      key={title}
                      className="py-4 px-8 text-red-700 font-semibold border-b border-red-200 tracking-wide select-none"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fundings.map((fund) => (
                  <tr
                    key={fund._id}
                    className="border-t border-red-100 hover:bg-red-50 transition cursor-pointer"
                    tabIndex={0}
                    aria-label={`Funding by ${
                      fund.userName || "Anonymous"
                    } of $${fund.amount.toFixed(2)} on ${new Date(
                      fund.date
                    ).toLocaleDateString()}`}
                  >
                    <td className="py-5 px-8 font-medium text-gray-800">
                      {fund.userName || fund.user?.name || "Anonymous"}
                    </td>
                    <td className="py-5 px-8 text-red-600 font-semibold">
                      ${fund.amount.toFixed(2)}
                    </td>
                    <td className="py-5 px-8 text-gray-600">
                      {new Date(fund.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for small screens */}
          <div className="sm:hidden space-y-4">
            {fundings.map((fund) => (
              <div
                key={fund._id}
                className="p-4 border border-red-200 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer"
                tabIndex={0}
                aria-label={`Funding by ${
                  fund.userName || "Anonymous"
                } of $${fund.amount.toFixed(2)} on ${new Date(
                  fund.date
                ).toLocaleDateString()}`}
              >
                <p className="text-lg font-semibold text-red-700">
                  {fund.userName || fund.user?.name || "Anonymous"}
                </p>
                <p className="text-red-600 font-bold text-xl my-1">
                  ${fund.amount.toFixed(2)}
                </p>
                <p className="text-gray-600 text-sm">
                  {new Date(fund.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="mt-8 flex flex-wrap justify-center gap-3"
              aria-label="Pagination Navigation"
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-5 py-2 rounded-full border border-red-300 text-red-600 font-semibold hover:bg-red-50 disabled:opacity-50 transition"
                aria-disabled={currentPage === 1}
                aria-label="Previous page"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-5 py-2 rounded-full border font-semibold transition ${
                    currentPage === i + 1
                      ? "bg-red-600 text-white border-red-600 shadow-lg"
                      : "border-red-300 text-red-600 hover:bg-red-50"
                  }`}
                  aria-current={currentPage === i + 1 ? "page" : undefined}
                  aria-label={`Page ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-5 py-2 rounded-full border border-red-300 text-red-600 font-semibold hover:bg-red-50 disabled:opacity-50 transition"
                aria-disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default FundingPage;
