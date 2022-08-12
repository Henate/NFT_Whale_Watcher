import React from "react";
import { Table } from "antd";
import { useState, useEffect } from "react";
import { Icon } from "web3uikit";
import etherscan from "../images/etherscan.png";
import opensea from "../images/opensea.png";
import { useNavigate, useParams } from "react-router-dom";
import { allCollections } from "../collectionsFile";
import axios from "axios";

function Collection() {
  const [data, setData] = useState();
  const [collectionData, setCollectionData] = useState();
  const [largest, setLargest] = useState("NA");
  const [highBuy, setHighBuy] = useState("NA");
  const [longHold, setLongHold] = useState("NA");
  const { collection } = useParams();

  useEffect(() => {
    const result = allCollections.filter((obj) => {
      return obj.slug === collection;
    });

    setCollectionData(result[0]);

    async function getCol() {
      const res = await axios.get("http://localhost:4000/collection", {
        params: { slug: collection },
      });

      const data = res.data;
      const dataArray = Object.values(data);
      setData(dataArray);

      const bags = dataArray.map((a) => a.amount);
      const holds = dataArray.map((a) => a.avgHold);
      const prices = dataArray.map((a) => a.avgPrice);
      const highestAmount = Math.max(...bags);
      const longestHold = Math.max(...holds);
      const highestBuy = Math.max(...prices);
      setLargest(highestAmount);
      setHighBuy(highestBuy.toFixed(2));
      setLongHold(Math.floor(longestHold));
    }

    getCol();
  }, [collection]);

  const columns = [
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Current Quantity",
      dataIndex: "amount",
    },

    {
      title: "Avg Days Held",
      dataIndex: "avgHold",
    },
    {
      title: "Avg Price",
      dataIndex: "avgPrice",
    },
    {
      title: "Quantity Change",
      dataIndex: "recentTx",
    },
  ];

  return (
    <>
      {collectionData && (
        <div className="title">
          <img src={collectionData.img} alt="colLogo" className="logoImg" />
          {collectionData.name}
        </div>
      )}
      <div className="stats">
        <div className="colStats">
          <div>
            <div className="stat">{longHold}</div>
            Longest Avg Hold
          </div>
          <div>
            <div className="stat">{largest}</div>
            Largest Bag
          </div>

          <div>
            <div className="stat">
              <Icon fill="#ffffff" svg="eth" />
              {highBuy}
            </div>
            Highest Avg Buy In
          </div>
        </div>
        <div className="colLinks">
          <img src={opensea} alt="os" className="link" />
          <img src={etherscan} alt="es" className="link" />
        </div>
      </div>
      <div className="App">
        <div className="tableContainer">
          <Table columns={columns} dataSource={data} />
        </div>
      </div>
    </>
  );
}

export default Collection;
