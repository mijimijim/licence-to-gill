import React, { Component } from 'react';
import Eos from 'eosjs'; // https://github.com/EOSIO/eosjs

// material-ui dependencies
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingLeft: '10vw',
    paddingRight: '10vw',
    paddingTop: '5vh',
  },
  card: {
    marginLeft: 20,
    marginTop: 0,
    marginBottom: 60,
    background: "#fafafa",
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  formButton: {
    marginTop: theme.spacing.unit,
    width: "100%",
  },
  pre: {
    background: "#ccc",
    padding: 10,
    marginBottom: 0.
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "80%",
    color: "#fff",
  },
  searchField: {
    marginLeft: "10vw",
    marginRight: "10vw",
  },
  formElement: {
    width: "80%",
    color: "#fff"
  },
  cover: {
    width: "100%",
    height: 300,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
  },
  appBar: {
    background: '#2196f3'/*"#00838e"*/
  },
  line: {
    position: "absolute",
    top: 200,
    left: 300,
    width: 20,
    height: "200%",
    backgroundColor: "#2196f3",
    zIndex: -1,
  }
});

// Index component
class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      noteTable: [] // to store the table rows from smart contract
    };
    this.handleFormEvent = this.handleFormEvent.bind(this);
  }

  // generic function to handle form events (e.g. "submit" / "reset")
  // push transactions to the blockchain by using eosjs
  async handleFormEvent(event) {
    // stop default behaviour
    event.preventDefault();

    // collect form data
    let account = event.target.txSearch.value;
    let privateKey = event.target.txSearch.value;
    let note = event.target.txSearch.value;

    // prepare variables for the switch below to send transactions
    let actionName = "";
    let actionData = {};

    // define actionName and action according to event type
    switch (event.type) {
      case "submit":
        actionName = "update";
        actionData = {
          _user: account,
          _note: note,
        };
        break;
      default:
        return;
    }

    // eosjs function call: connect to the blockchain
    const eos = Eos({keyProvider: privateKey});
    const result = await eos.transaction({
      actions: [{
        account: "notechainacc",
        name: actionName,
        authorization: [{
          actor: account,
          permission: 'active',
        }],
        data: actionData,
      }],
    });

    console.log(result);
    this.getTable();
  }

  // gets table data from the blockchain
  // and saves it into the component state: "noteTable"
  getTable() {
    const eos = Eos();
    eos.getTableRows({
      "json": true,
      "code": "notechainacc",   // contract who owns the table
      "scope": "notechainacc",  // scope of the table
      "table": "notestruct",    // name of the table as specified by the contract abi
      "limit": 100,
    }).then(result => this.setState({ noteTable: result.rows }));
  }

  componentDidMount() {
    this.getTable();
  }

  render() {
    const { noteTable } = this.state;
    const { classes } = this.props;

    // generate each note as a card
    const generateCard = (key, timestamp, user, note) => (
      <Card className={classes.card} key={key} elevation={1}>
        <CardMedia
          className={classes.cover}
          image="http://mall.capreg.framedev.com/media/1051/contactplaceholder.png?preset=person-profile"
          title="fisherman"
        />
      <CardContent>
          <Typography variant="headline" component="h2">
            {user}
          </Typography>
          <Typography style={{fontSize:12}} color="textSecondary" gutterBottom>
            {new Date(timestamp*1000).toString()}
          </Typography>
          <hr/>
          <Typography style={{fontSize:12}} color="textSecondary">
            {note}
          </Typography>
        </CardContent>
      </Card>
    );
    let noteCards = noteTable.map((row, i) =>
      generateCard(i, row.timestamp, row.user, row.note));

    return (
      <div>
        <div className={classes.line}></div>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <form onSubmit={this.handleFormEvent} className={classes.formElement}>
              <TextField
                 name="txSearch"
                 label="Search transaction"
                 type="search"
                 value={"7c75a962fca6e58187edc9673f66d1fbf9a5681b2eb6c50fa45fe9e81b021546"}
                 className={classes.searchField}
                 margin="normal"
                 fullWidth
               />
            </form>
          </Toolbar>
        </AppBar>
￼

        <Grid container justify="center" className={classes.root}>
          <Grid item xs={12}>
            {noteCards}
              <Card className={classes.card} elevation={1}>
                <CardMedia
                  className={classes.cover}
                  image="https://cdn.pixabay.com/photo/2016/09/19/14/59/old-fashioned-1680437_960_720.jpg"
                  title="fisherman"
                />
                <CardContent >
                  <Typography variant="headline" component="h2">
                    Jim the Fishmonger
                  </Typography>
                  <Typography style={{fontSize:12}} color="textSecondary" gutterBottom>
                    Sun 5 Aug 9.00am
                  </Typography>
                  <hr/>
                  <Typography style={{fontSize:12}} color="textSecondary">
                    Jim has been fishing in the waters in Tasmania for 30 years.
                    He always makes sure that he fishes sustainably, as his
                    waters support his family and his community. He keeps his
                    shop open everyday except Sunday: Sunday is for his wife and
                    children.
                  </Typography>
                </CardContent>
              </Card>
              <Card className={classes.card} elevation={1}>
                <CardMedia
                  className={classes.cover}
                  image="https://cdn.pixabay.com/photo/2017/07/24/21/37/fish-2536121_960_720.jpg"
                  title="fisherman"
                />
                <CardContent >
                  <Typography variant="headline" component="h2">
                    Ahmed & Co. Fish Distributors
                  </Typography>
                  <Typography style={{fontSize:12}} color="textSecondary" gutterBottom>
                    Fri 3 Aug 9.00am
                  </Typography>
                  <hr/>
                  <Typography style={{fontSize:12}} color="textSecondary">
                    Ahmed wakes up at 2am each morning to buy his fish from the
                    Central Tasmanian Markets. He knows who catch the best fish
                    and he is happy to pay for it. Ahmed will never divulge what
                    his secrets are for picking the best fish. Did you know that
                    Ahmed has been driving the same truck for over 20 years?
                  </Typography>
                </CardContent>
              </Card>
              <Card className={classes.card} elevation={1}>
                <CardMedia
                  className={classes.cover}
                  image="https://cdn.pixabay.com/photo/2016/02/12/10/15/netting-1195767_960_720.jpg"
                  title="fisherman"
                />
                <CardContent >
                  <Typography variant="headline" component="h2">
                    Susan & Louise Local Fishing Inc.
                  </Typography>
                  <Typography style={{fontSize:12}} color="textSecondary" gutterBottom>
                    Wed 1 Aug 9.00am
                  </Typography>
                  <hr/>
                  <Typography style={{fontSize:12}} color="textSecondary">
                    Susan & Louise have  been fishing in the waters in Tasmania
                    for 30 years. They always makes sure that they fish
                    sustainably, as the waters around there support the entire
                    community. They've been fishing for 5 generations and don't
                    plan on stopping anytime soon.
                  </Typography>
                </CardContent>
              </Card>
          </Grid>
        </Grid>
      </div>
    );
  }

}

export default withStyles(styles)(Index);
