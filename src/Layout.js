import './App.css';
import { Navbar, Container, Nav, Button, Col} from 'react-bootstrap';

export default function Layout(props) {
    return (
        <div className="main">
        <div>
            <header>
                <Navbar bg="light" expand="lg" style={{ padding: "10px" }}>
                    <Container>
                        <Col md={9}>
                            <Navbar.Brand><b>{props.title}</b></Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        </Col>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Button variant="success" type={props.button1.type} form={props.button1.form} size="sm" onClick={props.button1.action} style={{ marginRight: "100px" }}>{props.button1.name}</Button>
                                <Button variant="danger" type={props.button2.type} form={props.button2.form} size="sm" id={props.button2.id} onClick={props.button2.action}>{props.button2.name}</Button>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <hr/>
            </header>
            <main>
                <Container>
                    {props.content}
                </Container>
            </main>
            </div>
            <footer>
                <hr/>
                Scandiweb Test assignment
            </footer>
        </div>
    )
}