import { useEffect, useState } from 'react';

import PrevState from './hooks/prevState'

import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

function App() {

  const [term, setTerm] = useState("javascript")
  const [list, setList] = useState([])
  const prevTerm = PrevState(term);


  useEffect(() => {
    const searchAPI = async () => {
      const response = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          "action": "query",
          "format": "json",
          "origin": "*",
          "list": "search",
          "srsearch": term
        }
      })
      setList(response.data.query.search)
    }

    if (!list.length && term) {
      searchAPI();
    } else {
      const deobounce = setTimeout(() => {
        if (term) {
          searchAPI();
        }
      }, 1000);

      return () => {
        clearTimeout(deobounce)
      }
    }

  }, [term, list.length, prevTerm])

  const showList = list.map(el => (
    <tr key={el.pageid} style={{ border: "1px solid gray" }}>
      <td>{el.title}</td>
      <span dangerouslySetInnerHTML={{ __html: el.snippet }} />
    </tr>
  )

  )

  return (
    <Container>
      <Row className="mt-3">
        <Col>
          <Form >
            <Form.Group className="mb-3" controlId="formBasicEmail">

              <Form.Control type="text"
                placeholder="search input"
                onChange={(e) => setTerm(e.target.value)}
                value={term}
              />

            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <table style={{ border: "1px solid gray" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>{showList}</tbody>
          </table>
        </Col>
      </Row>
    </Container>

  );
}

export default App;
