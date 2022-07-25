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
    // TODO clear the search box after search is done  13,87 this is not working
    setKeyword("");
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        type="text"
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
