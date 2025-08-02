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
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="border p-2 rounded" />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {processing ? "Processing..." : "Pay"}
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
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
          className="bg-white p-6 rounded-lg w-96 shadow relative"
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Funding</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Give Fund
        </button>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-2 right-3 text-gray-500 hover:text-black"
            aria-label="Close modal"
          >
            ✕
          </button>
          <h2 className="text-xl font-semibold mb-4">Enter Amount</h2>
          <input
            type="number"
            value={amountToFund}
            min="1"
            onChange={(e) => setAmountToFund(e.target.value)}
            placeholder="Amount in USD"
            className="w-full border px-3 py-2 rounded mb-4"
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
        <p>Loading fundings...</p>
      ) : fundings.length === 0 ? (
        <p>No funding records found.</p>
      ) : (
        <>
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Amount (USD)</th>
                <th className="p-3 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {fundings.map((fund) => (
                <tr key={fund._id} className="text-center border-t">
                  <td className="p-3 border">
                    {fund.userName || fund.user?.name || "Anonymous"}
                  </td>
                  <td className="p-3 border">${fund.amount.toFixed(2)}</td>
                  <td className="p-3 border">
                    {new Date(fund.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-red-600 text-white" : ""
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
                className="px-3 py-1 border rounded disabled:opacity-50"
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
