import React from "react";
import { Table } from "antd";
import { useState, useEffect } from "react";
import { Icon, Badge } from "web3uikit";
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
  const navigate = useNavigate();
  const clickHandler = (addrs) => {
    navigate(`/${collection}/${addrs}`);
  };

  useEffect(() => {
    const result = allCollections.filter((obj) => {
      return obj.slug === collection;
    });

    setCollectionData(result[0]);
    getCol();
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
  }, [collection]);

  const columns = [
    {
      title: "地址",
      dataIndex: "address",
      render: (addr) => (
        <a onClick={() => clickHandler(addr)}>{`${addr.slice(
          0,
          6
        )}...${addr.slice(36)}`}</a>
      ),
    },
    {
      title: "当前持仓量",
      dataIndex: "amount",
      defaultSortOrder: "descend",
      sorter: {
        compare: (a, b) => a.amount - b.amount,
      },
    },

    {
      title: "持仓平均天数",
      dataIndex: "avgHold",
      sorter: {
        compare: (a, b) => a.avgHold - b.avgHold,
      },
    },
    {
      title: (
        <div className="App">
          持仓均价
          <Icon fill="#ffffff" svg="eth" />
        </div>
      ),
      dataIndex: "avgPrice",
      sorter: {
        compare: (a, b) => a.avgPrice - b.avgPrice,
      },
      render: (price) => price.toFixed(2),
    },
    {
      title: (
        <div className="App">
          持仓变化
          <Badge text="30Days" textVariant="caption12" />
        </div>
      ),
      dataIndex: "recentTx",
      sorter: {
        compare: (a, b) => a.recentTx - b.recentTx,
      },
      render: (num) => {
        if (num > 0) {
          return <div style={{ color: "green" }}>+{num}</div>;
        } else if (num < 0) {
          return <div style={{ color: "red" }}>{num}</div>;
        } else {
          return <div style={{ color: "yellow" }}>0</div>;
        }
      },
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
            最长持仓天数
          </div>
          <div>
            <div className="stat">{largest}</div>
            最大持仓量
          </div>

          <div>
            <div className="stat">
              <Icon fill="#ffffff" svg="eth" />
              {highBuy}
            </div>
            最高买入均价
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
