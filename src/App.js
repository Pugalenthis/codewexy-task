import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [coins, setCoins] = useState([]);
  const [listening, setListening] = useState(false);

  const [coinName, setCoinName] = useState("");
  const [price, setPrice] = useState(undefined);

  let data = {
    coin: coinName,
    price: Math.floor(price * 100) / 100,
  };

  useEffect(() => {
    if (!listening) {
      const events = new EventSource("http://localhost:8000/events");

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        setCoins((coins) => coins.concat(parsedData));
      };

      setListening(true);
    }
  }, [listening, coins]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:8000/coin`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mt-10  flex  justify-center items-center">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <input
              id="coin"
              placeholder="Enter coin name"
              className="border border-gray-400 px-2 py-1 focus:outline-none rounded-md"
              type="text"
              onChange={(e) => setCoinName(e.target.value)}
            />
            <input
              id="price"
              placeholder="Enter coin price"
              className="border border-gray-400 px-2 py-1 focus:outline-none mt-5 rounded-md"
              type="text"
              onChange={(e) => setPrice(e.target.value)}
            />
            <button
              type="submit"
              className="px-2 py-1 bg-blue-500 mt-7 text-white rounded-xl"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <div class="flex justify-center w-full  mt-20 ">
        <table class="w-3/4 text-sm text-left text-gray-500 dark:text-gray-400 ">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="py-3 px-6">
                Coin name
              </th>

              <th scope="col" class="py-3 px-6">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {coins.map((item) => (
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  class="py-4 px-6 font-medium text-gray-500 whitespace-nowrap "
                >
                  {item.coin}
                </th>
                <td class="py-4 px-6">{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
