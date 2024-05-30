import React, { useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardFooter,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";
import PerfectScrollbar from 'react-perfect-scrollbar'
import { sendQuestion } from "./api";


export default function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [question, setQuestion] = useState("")
  const [showQuestion, setShowQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  }

  const handleSendMessage = async () => {
    setShowQuestion(question)
    sendQuestion(question).then(
      (response) => setAnswer(response.data.data.jaccard.resposta)
    ).catch(error => alert(error));
  }

  const handleChangeText = (e) => {
    setQuestion(e.target.value)
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  // const handleInsert = async (receita) => {
  //   let recAux = JSON.parse(JSON.stringify(receita));
  //   treatCurrencyValues(recAux, "r");
  //   brazilianDateFormat(recAux, "r");
  //   await insertReceita(recAux);
  //   const request = await fetchReceitas();
  //   setReceitas(request.data);
  //   setOpenDialogInsert(false)
  //   fetchReceitasOnPage(page.number, recFiltro).then(
  //     (response) => setPage(response.data)
  //   );
  // }

  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
      <MDBRow className="d-flex justify-content-center">
        <MDBCol md="10" lg="8" xl="6">
          <MDBCard id="chat2" style={{ borderRadius: "15px" }}>
            <MDBCardHeader className="d-flex justify-content-between align-items-center p-3">
              <h5 className="mb-0">Chat</h5>
              <MDBBtn onClick={handleCollapse} color="primary" size="sm" rippleColor="dark">
                Let's Chat App
              </MDBBtn>
            </MDBCardHeader>
            <PerfectScrollbar
              style={{ position: "relative", height: "400px", display: isCollapsed ? 'none' : 'initial' }}
            >
              <MDBCardBody>
                <div className="d-flex flex-row justify-content-start" style={{maxWidth: 400, margin: "20px 0"}}>
                  <div>
                    <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                      Fala comigo patrão
                    </p>
                  </div>
                  <img
                    src="https://img.freepik.com/vetores-gratis/chatbot-mensagem-vectorart_78370-4104.jpg?size=626&ext=jpg"
                    alt="avatar 1"
                    style={{ width: "45px", height: "100%", borderRadius: '50px' }}
                  />
                </div>

                <div className="d-flex flex-row justify-content-end">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                    alt="avatar 1"
                    style={{ width: "45px", height: "100%" }}
                  />
                  <div style={{ maxWidth: 400 }}>
                    <p className="small p-2 ms-3 mb-1 rounded-3" style={{ backgroundColor: "#f5f6f7" }}>
                      {showQuestion}
                    </p>
                    {/* <p className="small p-2 ms-3 mb-1 rounded-3" style={{ backgroundColor: "#f5f6f7" }}>
                      How are you ...???
                    </p>
                    <p className="small p-2 ms-3 mb-1 rounded-3" style={{ backgroundColor: "#f5f6f7" }}>
                      What are you doing tomorrow? Can we come up a asasadafaergafasda?
                    </p>
                    <p className="small ms-3 mb-3 rounded-3 text-muted">
                      23:58
                    </p> */}
                  </div>
                </div>

                <div className="d-flex flex-row justify-content-start" style={{maxWidth: 400, margin: "20px 0"}}>
                  <div>
                    <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                    {answer}
                    </p>
                  </div>
                  <img
                    src="https://img.freepik.com/vetores-gratis/chatbot-mensagem-vectorart_78370-4104.jpg?size=626&ext=jpg"
                    alt="avatar 1"
                    style={{ width: "45px", height: "100%", borderRadius: '50px' }}
                  />
                </div>

                {/* <div className="divider d-flex align-items-center mb-4">
                  <p
                    className="text-center mx-3 mb-0"
                    style={{ color: "#a2aab7" }}
                  >
                    Today
                  </p>
                </div> */}

              </MDBCardBody>
            </PerfectScrollbar>
            <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                alt="avatar 3"
                style={{ width: "45px", height: "100%" }}
              />
              <input
                type="text"
                className="form-control form-control-lg"
                id="exampleFormControlInput1"
                placeholder="Digite sua dúvida"
                value={question}
                autoComplete="off"
                onChange={handleChangeText}
                onKeyDown={handleKeyDown}
              ></input>
              <a className="ms-1 text-muted" href="#!">
                <MDBIcon fas icon="paperclip" />
              </a>
              <a className="ms-3 text-muted" href="#!">
                <MDBIcon fas icon="smile" />
              </a>
              <a className="ms-3" href="#!" onClick={handleSendMessage}>
                <MDBIcon fas icon="paper-plane" />
              </a>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}