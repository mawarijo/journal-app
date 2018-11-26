import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import styled from 'react-emotion';

import * as journals from '../../constants/journalTypes';
import * as fields from '../../constants/fieldTypes';
import FormSection from './FormSection';
import FormGroup from './FormGroup';
import FormField from './FormField';

const Form = styled('form')`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 35rem;
`;

const SubmitButton = styled('button')`
  background: ${({ theme }) => theme.default.primary500};
  border: none;
  border-radius: 0.25rem;
  color: white;
  cursor: pointer;
  font-size: 1.3rem;
  margin: 2rem;
  padding: 1rem 2rem;
  text-transform: uppercase;
  &:hover {
    background: ${({ disabled, theme }) =>
      !disabled && theme.default.primary400};
  }
  &:disabled {
    background: ${({ theme }) => theme.default.grey500};
    cursor: default;
  }
`;

class JournalForm extends React.Component {
  state = {
    showMorning: new Date().getHours() < 15 && new Date().getHours() > 2,
    showEvening: new Date().getHours() > 14 || new Date().getHours() < 3
  };

  toggleShowMorning = e => {
    e.preventDefault();
    this.setState(prevState => ({ showMorning: !prevState.showMorning }));
  };

  toggleShowEvening = e => {
    e.preventDefault();
    this.setState(prevState => ({ showEvening: !prevState.showEvening }));
  };

  renderSections = timeOfDay => {
    return journals[this.props.journalType][timeOfDay].map(section => {
      console.log('fields[section.type]: ', fields[section.type]);
      console.log('section: ', section);
      return section.count > 1 ? (
        <FormGroup
          key={section.type}
          {...section}
          {...fields[section.type]}
          evening={timeOfDay === 'evening'}
        />
      ) : (
        <Field
          component={FormField}
          evening={timeOfDay === 'evening'}
          key={section.type}
          legend
          name={section.type}
          {...fields[section.type]}
        />
      );
    });
  };
  render() {
    const { pristine, submitting } = this.props;
    return (
      <Form
        onSubmit={this.props.handleSubmit(values =>
          this.props.handleSubmitJournal(values)
        )}
      >
        <FormSection
          onClick={this.toggleShowMorning}
          show={this.state.showMorning}
          timeOfDay="Morning"
        >
          {this.state.showMorning && this.renderSections('morning')}
        </FormSection>
        <FormSection
          evening
          onClick={this.toggleShowEvening}
          show={this.state.showEvening}
          timeOfDay="Evening"
        >
          {this.state.showEvening && this.renderSections('evening')}
        </FormSection>
        <SubmitButton disabled={pristine || submitting} type="submit">
          Save
        </SubmitButton>
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  journalType: state.auth.settings.journalType
});

const StatefulJournalForm = connect(mapStateToProps)(JournalForm);

export default reduxForm({
  form: 'journalForm'
})(StatefulJournalForm);
