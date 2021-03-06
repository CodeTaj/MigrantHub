import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import { AuthConsumer } from 'routes/AuthContext';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from '@material-ui/core/CircularProgress';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import EventCard from 'events/EventCard';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import update from 'immutability-helper';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  loader: {
    margin: 5,
  },
});

class SearchEventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      redirectToEventForm: false,
      offset: 0,
      limit: 20,
      moreData: true,
    };
  }

  fetchData = () => {
    const { location } = this.props;
    const { limit } = this.state;
    const { offset } = this.state;

    let searchQuery = '';
    let searchMode = false;

    if (location.state) {
      if (location.state.searchMode) {
        searchMode = location.state.searchMode;
        searchQuery = location.state.searchQuery;
      }
    }

    axios.get('/api/events/', {
      params: {
        editOwner: '',
        searchQuery,
        search: searchMode,
        offset,
        limit,
      },
    }).then((response) => {
      if (response.data.length === 0) {
        this.setState({ moreData: false });
      } else {
        this.setState(prevState => ({
          moreData: true,
          items: prevState.items.concat(response.data),
          offset: prevState.offset + response.data.length,
        }));
      }
    });
  }

  addSavedEvent = (eventId, index) => {
    axios.put(`/api/events/saved/${eventId}`)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            items: update(this.state.items, { [index]: { savedEvent: { $set: true } } }),
          });
          toast.success('Event Post Saved!');
        }
      }).catch((error) => {
        toast.error('Error Saving Event Post!');
      });
  };

  deleteSavedEvent = (eventId, index) => {
    axios.delete(`/api/events/saved/${eventId}`)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            items: update(this.state.items, { [index]: { savedEvent: { $set: false } } }),
          });
          toast.success('Event Post Unsaved!');
        }
      }).catch((error) => {
        toast.error('Error Unsaving Event Post!');
      });
  };

  render() {
    const { classes } = this.props;
    const { items, moreData } = this.state;

    return (
      <AuthConsumer>
        {({ user }) => (
          <>
            <div className={classes.mainContainer}>
              <div>
                <b><FormattedMessage id="search.events" /></b>
                <hr />
              </div>
              <InfiniteScroll
                pageStart={0}
                loadMore={() => this.fetchData(this.props.redirect, this.props)}
                hasMore={moreData}
                loader={(
                  <Grid item style={{ paddingBottom: 15 }}>
                    <CircularProgress className={classes.loader} disableShrink />
                  </Grid>
              )}
                threshold={-200}
                useWindow={false}
                getScrollParent={() => document.getElementById('mainPanel')}
              >
                <GridContainer justify="center">
                  {' '}
                  {
                  items.map((item, index) => (
                    <GridItem>
                      <EventCard
                        eventId={item._id}
                        eventName={item.eventName}
                        eventImagePath={item.eventImagePath}
                        eventDescription={item.description}
                        eventLocation={item.location}
                        dateStart={item.dateStart}
                        dateEnd={item.dateEnd}
                        timeStart={item.timeStart}
                        timeEnd={item.timeEnd}
                        savedEvent={item.savedEvent}
                        itemIndex={index}
                        addSavedEvent={this.addSavedEvent}
                        deleteSavedEvent={this.deleteSavedEvent}
                      />
                    </GridItem>
                  ))
                }
                </GridContainer>
              </InfiniteScroll>
            </div>
          </>
        )}
      </AuthConsumer>
    );
  }
}

SearchEventList.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(SearchEventList);
