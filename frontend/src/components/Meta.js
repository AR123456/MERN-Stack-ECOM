import React from "react";
import { Helmet } from "react-helmet";
// passing in props
const Meta = ({ title, description, keywords }) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
        <meta name="keywords" content={keywords}></meta>
      </Helmet>
    </>
  );
};
// passing in some default props
Meta.defaultProps = {
  title: "Welcome ! ",
  description: "Check this out !",
  keywords: "products, fun, buy",
};
export default Meta;
