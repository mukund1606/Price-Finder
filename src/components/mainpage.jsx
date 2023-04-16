import Html5QrcodePlugin from "@/components/BarcodeScanner";
import { useEffect, useState } from "react";

export default function MainPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [name, setName] = useState("");
  const [nameData, setNameData] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [data, setData] = useState(null);
  const [codeData, setCodeData] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [finalprice, setFinalPrice] = useState(0);
  const [filteredList, setFilteredList] = useState(null);

  const onNewScanResult = (decodedText) => {
    setBarcode(decodedText);
    setCodeData(null);
    setName("");
    getData(decodedText);
    alert("Barcode Scanned");
  };
  async function getData(barcode) {
    if (barcode === "") {
      setData(null);
      alert("No Barcode or Alias Found");
      return;
    }
    const res = await fetch(`/api/data?barcode=${barcode}`);
    const data = await res.json();
    if (res.status === 404 || data.name === undefined) {
      setData(null);
      alert("No Data Found");
      return;
    }
    setData(data);
    console.log(data);
    setDiscount(Math.round(data.salediscount * 100) / 100);
    setFinalPrice(
      Math.round(data.saleprice * (1 - data.salediscount / 100) * 100) / 100
    );
  }

  async function getDataByCode(code) {
    const res = await fetch(`/api/code?code=${code}`);
    const data = await res.json();
    setCodeData(data);
  }
  function searchWord(string, subString) {
    const subStringArr = subString.split(" ");
    for (let i = 0; i < subStringArr.length; i++) {
      if (string.toLowerCase().indexOf(subStringArr[i].toLowerCase()) === -1) {
        return false;
      }
    }
    return true;
  }
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/names`);
      const data = await res.json();
      setNameData(data);
      setIsLoaded(true);
    }
    fetchData();
  }, []);

  return (
    <>
      {!isLoaded ? (
        <>
          <div className="flex items-center justify-center">
            <h1 className="text-4xl font-bold">Loading...</h1>
          </div>
        </>
      ) : (
        <>
          <div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex flex-col items-center justify-center w-full p-1 border lg:w-2/6 rounded-xl">
                <div className="flex w-full">
                  <input
                    type="text"
                    name="namedata"
                    id="namedata"
                    value={name}
                    placeholder="Enter Name"
                    onChange={(e) => {
                      setName(e.target.value);
                      setCodeData(null);
                      setBarcode("");
                      setData(null);
                      setFilteredList(
                        nameData.filter((item) => {
                          return (
                            searchWord(item.name, e.target.value) ||
                            searchWord(item.alias, e.target.value)
                          );
                        })
                      );
                    }}
                    className="flex-grow w-full p-4 border outline-none rounded-xl"
                  />
                </div>
                {filteredList && filteredList.length > 0 && (
                  <div className="flex flex-col w-full gap-2 pt-5">
                    {codeData &&
                      codeData.length > 0 &&
                      codeData.map((item, i) => {
                        {
                          console.log(item);
                          {
                            if (codeData.length > 1) {
                              if (item.alias === "" && item.barcode === null) {
                                return;
                              }
                            }
                          }
                        }
                        return (
                          <div
                            key={item.code + item.barcode + i}
                            className="p-2 bg-gray-100 rounded-lg cursor-pointer"
                            onClick={() => {
                              if (
                                item.barcode === null &&
                                (item.alias === null || item.alias === "")
                              ) {
                                alert("No Barcode Found");
                                return;
                              } else if (
                                item.alias !== null &&
                                item.barcode === null
                              ) {
                                setName("");
                                setCodeData(null);
                                setBarcode(item.alias);
                                getData(item.alias);
                                return;
                              }
                              setName("");
                              setCodeData(null);
                              setBarcode(item.barcode);
                              getData(item.barcode);
                            }}
                          >
                            <h3 className="text-lg">
                              <span className="font-bold">Name:</span>{" "}
                              {item.name}
                            </h3>
                            <h3 className="text-lg">
                              <span className="font-bold">
                                {item.barcode ? "Barcode:" : "Alias:"}
                              </span>{" "}
                              {item.barcode || item.alias}
                            </h3>
                            <h3 className="text-lg">
                              <span className="font-bold">Worth:</span>{" "}
                              {item.mrp} ||{" "}
                              <span className="font-bold">MRP:</span>{" "}
                              {item.saleprice}
                            </h3>
                            <h3 className="text-lg">
                              <span className="font-bold">Qty:</span>{" "}
                              {item.quantity} x{" "}
                              <span className="font-bold">Net Price:</span>{" "}
                              {Math.round(
                                item.saleprice *
                                  (1 - item.salediscount / 100) *
                                  100
                              ) / 100}
                              <br />= <span className="font-bold">Amt.: </span>
                              {Math.round(
                                ((item.quantity *
                                  Math.round(
                                    item.saleprice *
                                      (1 - item.salediscount / 100) *
                                      100
                                  )) /
                                  100) *
                                  100
                              ) / 100}
                            </h3>

                            <h3 className="text-lg">
                              <span className="font-bold">
                                Effective Disc.:
                              </span>{" "}
                              {Math.round(
                                ((item.mrp -
                                  Math.round(
                                    item.saleprice *
                                      (1 - item.salediscount / 100) *
                                      100
                                  ) /
                                    100) /
                                  item.mrp) *
                                  10000
                              ) / 100}
                              % | ₹
                              {Math.round(
                                (item.mrp -
                                  Math.round(
                                    item.saleprice *
                                      (1 - item.salediscount / 100) *
                                      100
                                  ) /
                                    100) *
                                  item.quantity *
                                  100
                              ) / 100}{" "}
                              | ₹
                              {Math.round(
                                (item.mrp -
                                  Math.round(
                                    item.saleprice *
                                      (1 - item.salediscount / 100) *
                                      100
                                  ) /
                                    100) *
                                  100
                              ) / 100}
                              /pc
                            </h3>
                            <h3 className="text-lg">
                              <span className="font-bold">Sale Disc.:</span>{" "}
                              {item.salediscount}% | ₹
                              {Math.round(
                                (item.saleprice -
                                  Math.round(
                                    item.saleprice *
                                      (1 - item.salediscount / 100) *
                                      100
                                  ) /
                                    100) *
                                  item.quantity *
                                  100
                              ) / 100}{" "}
                              | ₹
                              {Math.round(
                                (item.saleprice -
                                  Math.round(
                                    item.saleprice *
                                      (1 - item.salediscount / 100) *
                                      100
                                  ) /
                                    100) *
                                  100
                              ) / 100}
                              /pc
                            </h3>
                          </div>
                        );
                      })}
                    {nameData &&
                      name !== "" &&
                      nameData.length > 0 &&
                      filteredList &&
                      filteredList.map((item, i) => {
                        if (i < 30) {
                          return (
                            <div
                              key={i}
                              className="p-2 bg-gray-100 rounded-lg cursor-pointer"
                              onClick={() => {
                                setName("");
                                getDataByCode(item.code);
                              }}
                            >
                              <h3 className="text-lg">
                                <span className="font-bold">Name:</span>{" "}
                                {item.name}
                              </h3>
                            </div>
                          );
                        }
                      })}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center justify-center gap-2 p-1 border lg:w-2/6 rounded-xl">
                <div className="flex items-center justify-center w-full p-4 border rounded-xl">
                  <input
                    type="text"
                    name="barcode-value"
                    id="barcodeData"
                    placeholder="Enter Barcode / Alias"
                    value={barcode}
                    className="flex-grow outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        getData(barcode);
                      }
                    }}
                    onChange={(e) => {
                      setBarcode(e.target.value);
                      setData(null);
                    }}
                  />
                  <button
                    onClick={() => {
                      getData(barcode);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </button>
                </div>
                {data && (
                  <div className="flex flex-col w-full gap-2 p-4 px-6 bg-gray-100 rounded-md">
                    <h3 className="text-lg">
                      <span className="font-bold">Name:</span> {data.name}
                    </h3>
                    <h3 className="text-lg">
                      <span className="font-bold">Barcode:</span> {data.barcode}
                    </h3>
                    <h3 className="text-lg">
                      <span className="font-bold">Worth:</span> {data.mrp} ||{" "}
                      <span className="font-bold">MRP:</span> {data.saleprice}
                    </h3>
                    <h3 className="text-lg">
                      <span className="font-bold">Qty:</span> {data.quantity} x{" "}
                      <span className="font-bold">Net Price:</span> {finalprice}
                      <br />= <span className="font-bold">Amt: </span>
                      {Math.round(data.quantity * finalprice * 100) / 100}
                    </h3>
                    <h3 className="text-lg">
                      <span className="font-bold">Effective Disc.:</span>{" "}
                      {Math.round(
                        ((data.mrp - finalprice) / data.mrp) * 10000
                      ) / 100}
                      % | ₹
                      {Math.round(
                        (data.mrp - finalprice) * data.quantity * 100
                      ) / 100}{" "}
                      | ₹{Math.round((data.mrp - finalprice) * 100) / 100}/pc
                    </h3>
                    <h3 className="text-lg">
                      <span className="font-bold">Sale Disc.:</span> {discount}%
                      | ₹
                      {Math.round(
                        (data.saleprice - finalprice) * data.quantity * 100
                      ) / 100}{" "}
                      | ₹{Math.round((data.saleprice - finalprice) * 100) / 100}
                      /pc
                    </h3>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center mt-5">
              <Html5QrcodePlugin
                className="w-5/6 md:w-3/6"
                qrCodeSuccessCallback={onNewScanResult}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
