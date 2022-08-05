import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
// TODO look at using useHistory hook instead lec 87 Q&A
const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState("");
  //   pass in event
  const submitHandler = (e) => {
    // this is a form so prevent default
    e.preventDefault();
    if (keyword.trim()) {
      // since search box will be embedded in the header will not have
      // direct access so need to use render prop
      history.push(`/search/${keyword}`);
    } else {
      // no keyword so back to home page
      history.push("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        // TODO look for way to make search happen as user typing
        // type="text"
        // DONE clear the search box after search is done offer X button to user, change type from text to search
        type="search"
        name="q"
        //   e.target.value gets what is in the box
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search Products..."
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="p-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
