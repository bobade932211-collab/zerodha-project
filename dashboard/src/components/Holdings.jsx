import { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import './holding.css'

// import { holdings } from "../data/data";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:3002/allholdings")
      .then((res) => {
        // console.log(res.data);
        setAllHoldings(res.data);
      })
      .catch((error) => {
        console.error("Error fetching holdings:", error);
        // Set empty array as fallback
        setAllHoldings([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const labels = allHoldings.map((subArray) => subArray["name"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  if (loading) {
    return (
      <>
        <h3 className="title">Holdings</h3>
        <div className="order-table">
          <div style={{ padding: '20px', textAlign: 'center' }}>
            Loading holdings...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        {allHoldings.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
            No holdings found. Please add some holdings to see them here.
          </div>
        ) : (
          <table cellSpacing={"12"}>
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Avg. cost</th>
                <th>LTP</th>
                <th>Cur. val</th>
                <th>P&L</th>
                <th>Net chg.</th>
                <th>Day chg.</th>
              </tr>
            </thead>
            <tbody>
              {allHoldings.map((stock, index) => {
                const curValue = stock.price * stock.qty;
                const isProfit = curValue - stock.avg * stock.qty >= 0.0;
                const profClass = isProfit ? "profit" : "loss";
                
                const dayClass = (stock.isLoss || false) ? "loss" : "profit";

                return (
                  <tr key={index}>
                    <td>{stock.name}</td>
                    <td>{stock.qty}</td>
                    <td>{stock.avg.toFixed(2)}</td>
                    <td>{stock.price.toFixed(2)}</td>
                    <td>{curValue.toFixed(2)}</td>
                    <td className={profClass}>
                      {(curValue - stock.avg * stock.qty).toFixed(2)}
                    </td>
                    <td className={profClass}>{stock.net}</td>
                    <td className={dayClass}>{stock.day}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="row mt-5 mb-3">
        <div className="col">
          <h5>
            29,875.<span>55</span>{" "}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            31,428.<span>95</span>{" "}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
