/**
=========================================================
* AI EBOOK DASHBOARD React - v4.0.3
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// AI EBOOK DASHBOARD React components
import SoftBox from "components/SoftBox";
import SoftProgress from "components/SoftProgress";

// RewardPage page components
import ProductCell from "layouts/rewards/rewards/reward-page/components/ProductCell";
import ReviewCell from "layouts/rewards/rewards/reward-page/components/ReviewCell";
import DefaultCell from "layouts/rewards/rewards/reward-page/components/DefaultCell";

// Images
import blackChair from "assets/images/ecommerce/black-chair.jpeg";
import chairPink from "assets/images/ecommerce/chair-pink.jpeg";
import chairSteel from "assets/images/ecommerce/chair-steel.jpeg";
import chairWood from "assets/images/ecommerce/chair-wood.jpeg";

const dataTableData = {
  columns: [
    { Header: "product", accessor: "product", width: "50%" },
    { Header: "price", accessor: "price", width: "10%" },
    { Header: "review", accessor: "review", align: "center" },
    { Header: "availability", accessor: "availability", align: "center", width: "40%" },
    { Header: "id", accessor: "id", align: "center" },
  ],

  rows: [
    {
      product: <ProductCell image={blackChair} name="Christopher Knight Home" />,
      price: <DefaultCell>$89.53</DefaultCell>,
      review: <ReviewCell rating={4.5} />,
      availability: (
        <SoftBox width="8rem">
          <SoftProgress variant="gradient" value={80} color="success" />
        </SoftBox>
      ),
      id: <DefaultCell>230019</DefaultCell>,
    },
    {
      product: <ProductCell image={chairPink} name="Bar Height Swivel Barstool" />,
      price: <DefaultCell>$99.99</DefaultCell>,
      review: <ReviewCell rating={5} />,
      availability: (
        <SoftBox width="8rem">
          <SoftProgress variant="gradient" value={90} color="success" />
        </SoftBox>
      ),
      id: <DefaultCell>87120</DefaultCell>,
    },
    {
      product: <ProductCell image={chairSteel} name="Signature Design by Ashley" />,
      price: <DefaultCell>$129.00</DefaultCell>,
      review: <ReviewCell rating={4.5} />,
      availability: (
        <SoftBox width="8rem">
          <SoftProgress variant="gradient" value={60} color="warning" />
        </SoftBox>
      ),
      id: <DefaultCell>412301</DefaultCell>,
    },
    {
      product: <ProductCell image={chairWood} name="Modern Square" />,
      price: <DefaultCell>$59.99</DefaultCell>,
      review: <ReviewCell rating={4.5} />,
      availability: (
        <SoftBox width="8rem">
          <SoftProgress variant="gradient" value={40} color="warning" />
        </SoftBox>
      ),
      id: <DefaultCell>001992</DefaultCell>,
    },
  ],
};

export default dataTableData;
