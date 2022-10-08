import React from "react";
import ReactApexChart from "react-apexcharts";

function Treemap() {
  const [graphData, setGraphData] = useState([]);

  const format = (data) => {
    const { items, quantities } = data;

    setGraphData(
      items.map((item, index) => {
        return {
          x: item,
          y: quantities[index],
        };
      })
    );
    console.log(graphData);
  };

  const getData = () => {
    fetch("http://127.0.0.1:8000/analytics/monthly_items").then(
      async (response) => {
        const data = await response.json();
        console.log(data);
        format(data);
      }
    );
  };

  useEffect(() => {
    getData();
  }, []);

  return <div>Treemap</div>;
}

export default Treemap;
