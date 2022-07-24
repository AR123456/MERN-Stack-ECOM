import React from "react";
// boostrap pagination
import { Pagination } from "react-bootstrap";
// for links to next page
import { LinkContainer } from "react-router-bootstrap";
//TODO make reusable not hardcoded 13,sect 87 Q&A
// will need several props set admin and keyword defaults

const Paginate = ({ pages, page, isAdmin = false, keyword = "" }) => {
  // only return if pages are greater than 1
  return (
    pages > 1 && (
      // TODO fix bug where admin sees admin product list pageination route when he want to
      // see the users view list of product patination routes  sect 87 Q&A
      <Pagination>
        {/* map through whatever the number of pages is if it is a keyword search use keyword route
        else use the page route  */}
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            // admin patination goes to diffrent route
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : `/page/${x + 1}`
                : `/admin/productlist/${x + 1}`
            }
          >
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
