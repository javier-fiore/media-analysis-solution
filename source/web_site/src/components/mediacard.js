import React, { Component } from 'react';
import { Storage } from 'aws-amplify';
import { Card, CardBody, CardSubtitle, CardHeader, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { withAuthenticator } from 'aws-amplify-react';
import preview from '../img/preview.png';

class MediaCard extends Component {
  constructor(props) {
	    super(props)
      this.state = {
        media: preview
      }
    }

  componentDidMount() {
      var self = this;
      Storage.get(self.props.item.thumbnail,{level: 'private'})
      .then(function(result) {
        //console.log(result);
        self.setState({
          media: result
        });
      })
      .catch(function(err) {
        //console.log(err);
        self.setState({
          media: preview
        });
      });
  }

  render(){
    var name = this.props.item.name;
    var result_link = ["/result",this.props.item.media_id].join('/');
    var file_type = this.props.item.file_type;

    return(
      <div>
          <Card className="text-center" body outline color="secondary">
            <CardHeader style={{"whiteSpace":"nowrap","textOverflow": "ellipsis","overflow": "hidden"}} title={name}>{name}</CardHeader>
            <CardBody>
              <div className="mt-2 mb-2" style={{"display": "flex", "justifyContent": "center", "alignItems": "center"}}>
                {(this.props.item.file_type === "jpg" || this.props.item.file_type === "jpeg" || this.props.item.file_type === "png") &&
                  <img alt="preview" src={this.state.media} style={{"height":"auto","maxHeight":"150px"}}/>
                }
                {(this.props.item.file_type === "wav" || this.props.item.file_type === "wave" || this.props.item.file_type === "flac" || this.props.item.file_type === "mp3") &&
                  <div style={{"width":"100%","height":"auto","maxHeight":"150px"}}>
                    <audio src={this.state.media} controls style={{"height":"150px","width":"100%"}}/>
                  </div>
                }
                {(this.props.item.file_type === "mp4" || this.props.item.file_type === "mov") &&
                  <video src={this.state.media} controls style={{"height":"auto","maxHeight":"150px"}}/>
                }
              </div>
                <div className="pt-2">
                  <Link to={result_link}>
                    <Button color="primary">View Results</Button>
                  </Link>
                </div>
            </CardBody>
          </Card>
      </div>
    );
  }
}

export default withAuthenticator(MediaCard);
