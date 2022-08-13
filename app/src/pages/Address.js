import React from "react";
import { useState, useEffect } from "react";
import { Table } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Blockie, Tooltip, Icon } from "web3uikit";
import { allCollections } from "../collectionsFile";
import { useMoralisWeb3Api, useMoralis } from "react-moralis";
import axios from "axios";

function Address() {
  const [txs, setTxs] = useState();
  const [collectionData, setCollectionData] = useState();
  const [colNfts, setColNfts] = useState([]);
  const { address, collection } = useParams();
  const Web3Api = useMoralisWeb3Api();
  const { isInitialized } = useMoralis();
  const navigate = useNavigate();
  const clickHandler = (addrs) => {
    navigate(`/${collection}/${addrs}`);
  };

  useEffect(() => {
    const result = allCollections.filter((obj) => {
      return obj.slug === collection;
    });

    setCollectionData(result[0]);

    async function searchAccount() {
      const res = await axios.get("http://localhost:4000/user", {
        params: { slug: collection, address: address },
      });
      const data = res.data;
      setTxs(data);
    }

    searchAccount();

    async function fetchUserCol() {
      const options = {
        address: address,
        token_address: collection,
      };
      const NFTs = await Web3Api.account.getNFTsForContract(options);
      setColNfts(NFTs.result);
    }

    if (isInitialized) {
      fetchUserCol();
    }
  }, [collection, isInitialized, address]);

  const columns = [
    {
      title: "事件",
      dataIndex: "from",
      render: (from) => {
        if (from === "0x0000000000000000000000000000000000000000") {
          return (
            <div className="App" style={{ color: "yellow", display: "flex" }}>
              <Icon svg="stars" fill="#ffffff" />
              Mint
            </div>
          );
        } else if (from === address) {
          return (
            <div className="App" style={{ color: "red", display: "flex" }}>
              <Icon svg="speedyNode" fill="#ffffff" />卖
            </div>
          );
        } else {
          return (
            <div className="App" style={{ color: "green", display: "flex" }}>
              <Icon svg="cart" fill="#ffffff" />买
            </div>
          );
        }
      },
    },
    {
      title: "Token ID",
      dataIndex: "tokenId",
    },
    {
      title: "价格",
      dataIndex: "price",
      render: (price) => (
        <div style={{ display: "flex" }}>
          <Icon svg="eth" fill="#ffffff" />
          {(Number(price) / 1e18).toFixed(2)}
        </div>
      ),
    },
    {
      title: "日期",
      dataIndex: "date",
      render: (date) => {
        let ms = new Date(date).getTime();
        let today = new Date().getTime();

        let diff = Math.floor((today - ms) / 86400000);

        return <div>{diff} 天前</div>;
      },
    },
    {
      title: "买家",
      dataIndex: "to",
      render: (addr) => (
        <a onClick={() => clickHandler(addr)}>{`${addr.slice(
          0,
          6
        )}...${addr.slice(36)}`}</a>
      ),
    },
    {
      title: "卖家",
      dataIndex: "from",
      render: (addr) => (
        <a onClick={() => clickHandler(addr)}>{`${addr.slice(
          0,
          6
        )}...${addr.slice(36)}`}</a>
      ),
    },
  ];

  return (
    <>
      {collectionData && (
        <div className="userTitle">
          <div>
            <img src={collectionData.img} alt="colLogo" className="logoImg" />
            {collectionData.name}
          </div>
          <div className="wallet">
            {`${address}`}
            <Blockie seed={address} />
          </div>
        </div>
      )}
      {colNfts && (
        <div className="imgList">
          <div>用户藏品一览</div>
          <div className="theImgs">
            {colNfts.map((e) => {
              return (
                <>
                  <Tooltip content={e.token_id}>
                    <img
                      src={JSON.parse(e.metadata).image}
                      className="colNfts"
                    />
                  </Tooltip>
                </>
              );
            })}
          </div>
        </div>
      )}
      <div className="App">
        <div className="tableContainer">
          <Table columns={columns} dataSource={txs} />
        </div>
      </div>
    </>
  );
}

export default Address;
