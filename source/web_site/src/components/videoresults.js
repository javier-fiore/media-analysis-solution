import React, { Component } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { Container, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Button, UncontrolledTooltip } from 'reactstrap';
//import play from '../img/play.png';
//import pause from '../img/pause.png';
//import restart from '../img/restart.png';

class VideoResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'labels',
      focusing: "nothing",
      boxes: [],
      captions: null,
    }
    this.tabToggle = this.tabToggle.bind(this);
    this.draw = this.draw.bind(this);
    this.videoControl = this.videoControl.bind(this);
  }


  tabToggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  videoControl(action) {
    var video = document.getElementById("resultvid");
    var self = this;
    if (action === "play") {
      if (video.paused || video.ended || video.currentTime === 0) {
        video.play();
        self.draw();
      }
    }
    else if (action === "pause") {
      video.pause();
    }
    else if (action === "restart") {
      video.pause();
      setTimeout(function () {
        video.currentTime = 0;
        video.play();
        self.draw();
      }, 20);
    }
  }

  drawCaption = (canvas, context, text) => {
    context.beginPath();
  
    const widthText = context.measureText(text).width + 20;
  
    const marginLeft = (canvas.width - widthText) / 2;
  
    context.fillStyle = "rgba(8, 8, 8, 0.65)";
    
    context.fillRect(marginLeft, canvas.height - 40, widthText, 19);
  
    context.font = "17px Comic Sans MS";
  
    context.fillStyle = "white";
    
    context.fillText(text, marginLeft + 10, canvas.height - 26);
  
    context.closePath();
  }

  draw() {
    var self = this;
    var div = document.getElementById("resultview");
    var video = document.getElementById("resultvid");
    var canvas = document.getElementById("resultcanvas");

    if (canvas == null) {

      //Create canvas
      canvas = document.createElement('canvas');

      //Configure canvas
      canvas.id = "resultcanvas";
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.style.maxWidth = "750px";
      canvas.style.maxHeight = "400px";
      canvas.style.position = "relative";
      video.style.display = 'none';

      //Append canvas to div
      div.appendChild(canvas);

      //Draw image
      var context = canvas.getContext('2d');
      //Hide image

      var interval = setInterval(function () { drawBoxes() }, 10);
      function drawBoxes() {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (self.state.captions) {
          const captions = self.props.captions[self.state.captions];
          if ((Math.ceil((video.currentTime * 1000) / 100) * 100) in captions) {
            self.drawCaption(canvas, context, captions[Math.ceil((video.currentTime*1000)/100)*100].Captions);
          }
        }
        let items = self.state.boxes;
        if ((Math.ceil((video.currentTime * 1000) / 100) * 100) in items) {
          Object.keys(items[Math.ceil((video.currentTime * 1000) / 100) * 100]).forEach(function (key) {
            let h = canvas.height * items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].BoundingBox.Height;
            let w = canvas.width * items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].BoundingBox.Width;
            let l = canvas.width * items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].BoundingBox.Left;
            let t = canvas.height * items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].BoundingBox.Top;
            context.beginPath();
            context.rect(l, t, w, h);
            context.lineWidth = 3;
            context.strokeStyle = 'red';
            context.stroke();
            if (items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].hasOwnProperty("Name")) {
              context.font = "15px Comic Sans MS";
              context.fillStyle = "red";
              context.fillText(items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].Name, l, t - 2);
            }
            else if (items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].hasOwnProperty("Index")) {
              context.font = "15px Comic Sans MS";
              context.fillStyle = "red";
              context.fillText(items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].Index, l, t - 2);
            }
            else if (items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].hasOwnProperty("Confidence")) {
              context.font = "15px Comic Sans MS";
              context.fillStyle = "red";
              context.fillText(items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].Confidence.toFixed(3), l, t - 2);
            }
            context.closePath();
          });
        }
        if (video.ended || video.paused) {
          clearInterval(interval);
        }
      }
    }

    else {
      //Canvas already exists

      var context = canvas.getContext('2d');

      var interval = setInterval(function () { drawBoxes() }, 10);
      function drawBoxes() {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (self.state.captions) {
          const captions = self.props.captions[self.state.captions];
          if ((Math.ceil((video.currentTime * 1000) / 100) * 100) in captions) {
            self.drawCaption(canvas, context, captions[Math.ceil((video.currentTime*1000)/100)*100].Captions);
          }
        }
        let items = self.state.boxes;
        if ((Math.ceil((video.currentTime * 1000) / 100) * 100) in items) {
          Object.keys(items[Math.ceil((video.currentTime * 1000) / 100) * 100]).forEach(function (key) {
            let h = canvas.height * items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].BoundingBox.Height;
            let w = canvas.width * items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].BoundingBox.Width;
            let l = canvas.width * items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].BoundingBox.Left;
            let t = canvas.height * items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].BoundingBox.Top;
            context.beginPath();
            context.rect(l, t, w, h);
            context.lineWidth = 3;
            context.strokeStyle = 'red';
            context.stroke();
            if (items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].hasOwnProperty("Name")) {
              context.font = "15px Comic Sans MS";
              context.fillStyle = "red";
              context.fillText(items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].Name, l, t - 2);
            }
            else if (items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].hasOwnProperty("Index")) {
              context.font = "15px Comic Sans MS";
              context.fillStyle = "red";
              context.fillText(items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].Index, l, t - 2);
            }
            else if (items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].hasOwnProperty("Confidence")) {
              context.font = "15px Comic Sans MS";
              context.fillStyle = "red";
              context.fillText(items[Math.ceil((video.currentTime * 1000) / 100) * 100][key].Confidence.toFixed(3), l, t - 2);
            }
            context.closePath();
          });
        }
        if (video.ended || video.paused) {
          clearInterval(interval);
        }
      }
    }
  }


  setCaption = (language) => {
    let {captions} = this.state;

    this.setState({captions: language === captions ? null : language});
  }

  render() {

    var file_type = this.props.filetype;

    //BUGFIX/media-analysis-35 mp4 and mov results are the same, removing if (mov) {}
    //var self = this;
    var file_name = this.props.filename;
    var media_source = this.props.mediafile;
    var labels = this.props.labels;
    //var faces = this.props.faces;
    //var face_matches = this.props.facematches;
    //var celebs = this.props.celebs;
    var phrases = this.props.phrases;
    var entities = this.props.entities;
    var transcript = this.props.transcript;
    var translate = this.props.translate;

    var atts = this.props.attributes.map((att, index) => {
      return (
      <div style={{"display":"inline-block"}} key={index}>
        <Button id={att.Name.replace(/\s+/g, '-').toLowerCase()} color="primary" className="ml-1 mr-1 mb-1 mt-1" onClick={() => { this.setState({ focusing: att.Name, boxes: att.Impressions }); }}>{att.Name}</Button>
        <UncontrolledTooltip placement="top" target={att.Name.replace(/\s+/g, '-').toLowerCase()}>
          {att.ConfidenceAverage.toFixed(3)}
        </UncontrolledTooltip>
      </div>
      )
    });

    var celebs = this.props.individualcelebs.map((celeb, index) => {
      return (<Button key={index} color="primary" className="ml-1 mr-1 mb-1 mt-1" onClick={() => { this.setState({ focusing: celeb.Name, boxes: celeb.Impressions }); }}>{celeb.Name}</Button>)
    });

    var face_matches = this.props.individualknownfaces.map((face, index) => {
      return (<Button key={index} color="primary" className="ml-1 mr-1 mb-1 mt-1" onClick={() => { this.setState({ focusing: face.Name, boxes: face.Impressions }); }}>{face.Name}</Button>)
    });

    const codeCaptions = Object.keys(this.props.captions).reduce((lastValue, lang) => {
      if (0 < Object.keys(this.props.captions[lang]).length) {
        lastValue = [...lastValue, lang];
      }

      return lastValue;
    }, []);

    return (
      <Container>
        <Row>
          <Col>
            <div>
              <h1 align="center">{file_name}</h1>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="8">
            <div id="resultview" align="center" className='mb-3' style={{ "overflow": "scroll", "maxWidth": "750px", "maxHeight": "400px", "margin-top":"20px" }}>
              <video id="resultvid" src={media_source} className="img-fluid" />
            </div>
          </Col>
          <Col md="4">
            <div>
              <h5>Current focus:</h5>
              <h6 align="center">{this.state.focusing}</h6>
            </div>
            <div>
              <hr className="my-2" />
              <h5>Controls:</h5>
            </div>
            <div align="center">
              <Button className="mr-2 my-2" color="info" onClick={() => { this.videoControl('play'); }}>Play</Button>
              <Button className="mr-2 my-2" color="info" onClick={() => { this.videoControl('pause'); }}>Pause</Button>
              <Button className="mr-2 my-2" color="info" onClick={() => { this.videoControl('restart'); }}>Restart</Button>
            </div>
            <div>
              <hr className="my-2" />
              <h5>Captions:</h5>
            </div>
            <div align="center">
              {
                codeCaptions.includes('en') && (
                  <Button className="mr-2 my-2" color="info" active={'en' === this.state.captions} onClick={() => { this.setCaption('en'); }}>English</Button>
                )
              }
              {
                codeCaptions.includes('es') && (
                  <Button className="mr-2 my-2" color="info" active={'es' === this.state.captions} onClick={() => { this.setCaption('es'); }}>Spanish</Button>
                )
              }
              {
                codeCaptions.includes('fr') && (
                  <Button className="mr-2 my-2" color="info" active={'fr' === this.state.captions} onClick={() => { this.setCaption('fr'); }}>Frances</Button>
                )
              }
              {
                codeCaptions.includes('zh') && (
                  <Button className="mr-2 my-2" color="info" active={'zh' === this.state.captions} onClick={() => { this.setCaption('zh'); }}>Chinese</Button>
                )
              }
              {
                codeCaptions.includes('tr') && (
                  <Button className="mr-2 my-2" color="info" active={'tr' === this.state.captions} onClick={() => { this.setCaption('tr'); }}>Turkish</Button>
                )
              }
              {
                codeCaptions.includes('pt') && (
                  <Button className="mr-2 my-2" color="info" active={'pt' === this.state.captions} onClick={() => { this.setCaption('pt'); }}>Portuguese</Button>
                )
              }
            </div>
            <div>
              <hr className="my-2" />
              <h5>Click to focus:</h5>
            </div>
            <div align="center">
              <Button color="primary" className="mr-2 mt-2" onClick={() => { this.setState({ focusing: "Persons", boxes: this.props.persons }); }}>Persons</Button>
              <Button color="primary" className="mr-2 mt-2" onClick={() => { this.setState({ focusing: "Faces", boxes: this.props.allfaces }); }}>Faces</Button>
              {/*<Button color="primary" className="mr-2 mt-2" onClick={() => { this.setState({ focusing: "Celebrities", boxes: this.props.celebvideo }); }}>Celebrities</Button>*/}
              <Button color="primary" className="mr-2 mt-2" onClick={() => { this.setState({ focusing: "Known collection", boxes: this.props.allknownfaces }); }}>Known Collection</Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              <Nav tabs className="mb-3">
                <NavItem>
                  <NavLink active={this.state.activeTab === "labels"} onClick={() => { this.tabToggle('labels'); }}>Labels</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={this.state.activeTab === "faces"} onClick={() => { this.tabToggle('faces'); }}>Facial Attributes</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={this.state.activeTab === "face_matches"} onClick={() => { this.tabToggle('face_matches'); }}>Known Collection</NavLink>
                </NavItem>
                { /* <NavItem>
                  <NavLink active={this.state.activeTab === "celebs"} onClick={() => { this.tabToggle('celebs'); }}>Celebrities</NavLink>
                </NavItem> */}
                <NavItem>
                  <NavLink active={this.state.activeTab === "transcript"} onClick={() => { this.tabToggle('transcript'); }}>Transcript</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={this.state.activeTab === "translate"} onClick={() => { this.tabToggle('translate'); }}>Translate</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={this.state.activeTab === "entities"} onClick={() => { this.tabToggle('entities'); }}>Entities</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active={this.state.activeTab === "phrases"} onClick={() => { this.tabToggle('phrases'); }}>Phrases</NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="labels">
                  <Row>
                    <Col align="center">
                      {labels}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="faces">
                  <Row>
                    <Col align="center">
                      {atts}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="face_matches">
                  <Row>
                    <Col align="center">
                      {face_matches}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="celebs">
                  <Row>
                    <Col align="center">
                      {celebs}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="phrases">
                  <Row>
                    <Col align="center">
                      {phrases}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="entities">
                  <Row>
                    <Col align="center">
                      {entities}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="translate">
                  <Row>
                    <Col align="center">
                      {translate}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="transcript">
                  <Row>
                    <Col align="center">
                      {transcript}
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withAuthenticator(VideoResults);
