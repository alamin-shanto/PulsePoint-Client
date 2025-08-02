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
        // Save funding info in your DB
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#333",
              "::placeholder": {
                color: "#999",
              },
              fontFamily: '"Inter", sans-serif',
              padding: "10px 12px",
            },
            invalid: {
              color: "#e53e3e",
            },
          },
          hidePostalCode: true,
        }}
        className="border border-gray-300 rounded-md p-3"
      />
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition"
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
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <FocusTrap
        focusTrapOptions={{
          fallbackFocus: "#modal-container",
        }}
      >
        <div
          id="modal-container"
          className="bg-white p-7 rounded-2xl w-full max-w-md shadow-lg relative"
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
  useContext(AuthContext); // prevent unused warning
  const [fundings, setFundings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [amountToFund, setAmountToFund] = useState("");
  const [refreshFundings, setRefreshFundings] = useState(false);

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

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-red-700">Funding</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-red-700 transition"
        >
          Give Fund
        </button>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold"
            aria-label="Close modal"
          >
            &times;
          </button>
          <h2 className="text-2xl font-semibold mb-6 text-center text-red-700">
            Enter Amount to Fund
          </h2>
          <input
            type="number"
            value={amountToFund}
            min="1"
            onChange={(e) => setAmountToFund(e.target.value)}
            placeholder="Amount in USD"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
            autoFocus
          />
          {amountToFund && +amountToFund > 0 && (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                amount={amountToFund}
                onSuccess={() => {
                  setShowModal(false);
                  setAmountToFund("");
                  setCurrentPage(1); // go to first page to see latest
                  setRefreshFundings((prev) => !prev); // trigger refresh
                }}
                onCancel={() => setShowModal(false)}
              />
            </Elements>
          )}
        </Modal>
      )}

      {loading ? (
        <p className="text-center py-12 text-red-600 font-semibold">
          Loading fundings...
        </p>
      ) : fundings.length === 0 ? (
        <p className="text-center py-12 text-gray-500 text-lg">
          No funding records found.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl shadow-lg border border-red-100">
            <table className="w-full text-center min-w-[480px] border-collapse">
              <thead className="bg-red-50">
                <tr>
                  <th className="py-3 px-6 text-red-700 font-semibold border-b border-red-200">
                    Name
                  </th>
                  <th className="py-3 px-6 text-red-700 font-semibold border-b border-red-200">
                    Amount (USD)
                  </th>
                  <th className="py-3 px-6 text-red-700 font-semibold border-b border-red-200">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {fundings.map((fund) => (
                  <tr
                    key={fund._id}
                    className="border-t border-red-100 hover:bg-red-50 transition"
                  >
                    <td className="py-4 px-6 font-medium text-gray-800">
                      {fund.userName || fund.user?.name || "Anonymous"}
                    </td>
                    <td className="py-4 px-6 text-red-600 font-semibold">
                      ${fund.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(fund.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded border border-red-300 text-red-600 font-semibold hover:bg-red-50 disabled:opacity-50 transition"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded border font-semibold transition ${
                    currentPage === i + 1
                      ? "bg-red-600 text-white border-red-600"
                      : "border-red-300 text-red-600 hover:bg-red-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded border border-red-300 text-red-600 font-semibold hover:bg-red-50 disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FundingPage;
