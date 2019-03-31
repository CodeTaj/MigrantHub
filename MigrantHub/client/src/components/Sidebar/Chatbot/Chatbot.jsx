import React, { Component } from "react";

// core components
import { Widget, addResponseMessage, addLinkSnippet } from 'react-chat-widget';
import { Redirect } from 'react-router-dom';
import logo from 'assets/img/logo_transparent.png';
import axios from "axios";

import './styles.css';  

class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conversation: [],
      redirectToRecommendation: false,
      suggestServiceId: 0,
      finishedSuggestionServiceFetch: false,
      redirectToAllServices: false,
      redirectToAllEvents: false,
      redirectToFrenchClasses: false,
      redirectToEmployementServices: false,
      redirectToSocialWelfare: false,
      redirectToBankingServices: false,
      redirectToChildBenefitServices: false,
      redirectToPensionServices: false,
      redirectToTaxesServices: false,
      redirectToLowIncomeHousing: false,
      redirectToHousingServices: false,
    };
  }

  componentDidMount() {
    addResponseMessage("Hey there!");
  }

  handleSubmit = (newMessage) => {
    if(!newMessage.trim()) return;

    axios.get('../api/chatbot/', {
      params: {
        userRequest: newMessage,
      },
    }).then((response) => {
      response.data.fulfillmentMessages.forEach(element => {
        this.setState({
          redirectToRecommendation: false,
        });
        addResponseMessage(element.text.text[0])
      });

      let intent = response.data.intent.displayName;
      if(intent === 'Recommendation Service'){
        this.setState({
          redirectToRecommendation: true,
        });
        this.renderRedirectToRecommendationService();
      }
      else if(intent == 'help - services'){
        this.setState({
          redirectToAllServices: true,
        });
      }
      else if(intent == 'help - events'){
        this.setState({
          redirectToAllEvents: true,
        });
      }
      else if(intent == 'Employment - Non French'){
        this.setState({
          redirectToFrenchClasses: true,
        });
        let linkToCenterClasses = {
          title: 'Our French Classes',
          link: 'https://www.therefugeecentre.org/classes',
          target: '_blank'
        };
        let linkToBookAppointment = {
          title: 'Book an appointment',
          link: 'http://tinyurl.com/y4jkubp4',
          target: '_blank'
        };
        addLinkSnippet(linkToCenterClasses);
        addResponseMessage("If you still want to try your luck without french, you can book an appointment with us.");
        addLinkSnippet(linkToBookAppointment);
        addResponseMessage("In the meantime, here is an organization that offers french classes you might be interested in.");
      }
      else if(intent == 'Employment - Oui French'){
        let linkToEmployementWorkshops = {
          title: 'Our Workshops',
          link: 'https://www.therefugeecentre.org/erc',
          target: '_blank'
        };
        addLinkSnippet(linkToEmployementWorkshops);
        addResponseMessage("If you can't make it, here is a list of services I recommend.");
        this.setState({
          redirectToEmployementServices: true,
        });
      }
      else if(intent == 'Financial Help - Social Welfare'){
        this.setState({
          redirectToSocialWelfare: true,
        });
      }
      else if(intent == 'Financial Help - Social Welfare - Qualifications'){
        let linkToSocialWelfareQualifications = {
          title: 'Qualifications',
          link: 'http://tinyurl.com/y4fjpwlt',
          target: '_blank'
        };
        addLinkSnippet(linkToSocialWelfareQualifications);
      }
      else if(intent == 'Financial Help - Banking/debt relief'){
        this.setState({
          redirectToBankingServices: true,
        });
      }
      else if(intent == 'Financial Help - Child Benefit'){
        this.setState({
          redirectToChildBenefitServices: true,
        });
      }
      else if(intent == 'Financial Help - University Loans & Burseries'){
        this.setState({
          redirectToBankingServices: true,
        });
      }
      else if(intent == 'Financial Help - Pensions'){
        this.setState({
          redirectToPensionServices: true,
        });
      }
      else if(intent == 'Financial Help - Taxes'){
        this.setState({
          redirectToTaxesServices: true,
        });
      }
      else if(intent == 'Housing - Low-income housing'){
        this.setState({
          redirectToLowIncomeHousing: true,
        });
      }
      else if(intent == 'Housing - Buy'){
        this.setState({
          redirectToHousingServices: true,
        });
      }
      else if(intent == 'Language - French' || 'Language - English'){
        this.setState({
          redirectToFrenchClasses: true,
        });
        let linkToCenterClasses = {
          title: 'Our Classes',
          link: 'https://www.therefugeecentre.org/classes',
          target: '_blank'
        };
        addLinkSnippet(linkToCenterClasses);
      }
    })
  }

  keyPress = event => {
    if(event.keyCode == 13) {
      this.handleSubmit(event);
    }
  }

  renderRedirectToRecommendationService = () => {
    const redirectToRecommendation = this.state.redirectToRecommendation;
    if (redirectToRecommendation) {
      axios.get('/api/services/recommendations').then((response) => {
        this.setState({
          suggestServiceId: response.data[0]._id,
          finishedSuggestionServiceFetch: true,
        });
      });
    }
  }

  render() {
    if(this.state.redirectToRecommendation && this.state.serviceId != 0 && this.state.finishedSuggestionServiceFetch){
      this.setState({
        redirectToRecommendation: false,
        finishedSuggestionServiceFetch: false,
      });
      return <Redirect to={`/services/${this.state.suggestServiceId}`} />
    }
    else if(this.state.redirectToAllServices){
      this.setState({
        redirectToAllServices: false,
      });
      return <Redirect to="/services" />
    }
    else if(this.state.redirectToAllEvents){
      this.setState({
        redirectToAllEvents: false,
      });
      return <Redirect to="/events" />
    }
    else if(this.state.redirectToFrenchClasses){
      this.setState({
        redirectToFrenchClasses: false,
      });
      return <Redirect to="/services/5c63a6d4e890b00034a5f159"/>
    }
    else if(this.state.redirectToEmployementServices){
      this.setState({
        redirectToEmployementServices: false,
      });
      return <Redirect to={{
        pathname: '/services/',
        state: {
          category: 'employement',
        },
      }}/>
    }
    else if(this.state.redirectToSocialWelfare){
      this.setState({
        redirectToSocialWelfare: false,
      });
      return <Redirect to={{
        pathname: '/services/',
        state: {
          category: 'welfare',
        },
      }}/>
    }
    else if(this.state.redirectToBankingServices){
      this.setState({
        redirectToBankingServices: false,
      });
      return <Redirect to={{
        pathname: '/services/',
        state: {
          category: 'BudgetAndDebtProblems',
        },
      }}/>
    }
    else if(this.state.redirectToChildBenefitServices){
      this.setState({
        redirectToChildBenefitServices: false,
      });
      return <Redirect to={{
        pathname: '/services/',
        state: {
          category: 'FamilyBenefits',
        },
      }}/>
    }
    else if(this.state.redirectToPensionServices){
      this.setState({
        redirectToPensionServices: false,
      });
      return <Redirect to={{
        pathname: '/services/',
        state: {
          category: 'pensions',
        },
      }}/>
    }
    else if(this.state.redirectToTaxesServices){
      this.setState({
        redirectToTaxesServices: false,
      });
      return <Redirect to={{
        pathname: '/services/',
        state: {
          category: 'IncomeTaxes',
        },
      }}/>
    }
    else if(this.state.redirectToLowIncomeHousing){
      this.setState({
        redirectToLowIncomeHousing: false,
      });
      return <Redirect to={{
        pathname: '/services/',
        state: {
          category: 'SocialHousing',
        },
      }}/>
    }
    else if(this.state.redirectToHousingServices){
      this.setState({
        redirectToHousingServices: false,
      });
      return <Redirect to={{
        pathname: '/services/',
        state: {
          category: 'housing',
        },
      }}/>
    }
    return (
      <Widget 
      handleNewUserMessage={this.handleSubmit} 
      profileAvatar={logo}
      title="MigrantHub Chat"
      subtitle=""
      badge="1"
      senderPlaceHolder="Type 'Help' for help"
      />
    )
  }
}

export default (Chatbot);
