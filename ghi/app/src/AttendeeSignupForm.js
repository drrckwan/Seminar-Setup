import React from 'react';

class AttendeeSignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            conferences: []
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleConferenceSelection = this.handleConferenceSelection.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    handleNameChange(event) {
        const value = event.target.value;
        this.setState({ name: value })
    };

    handleEmailChange(event) {
        const value = event.target.value;
        this.setState({ email: value });
    };

    handleConferenceSelection(event) {
        const value = event.target.value;
        this.setState({ conference: value });
    };

    async handleSubmit(event) {
        event.preventDefault();
        const data = { ...this.state };
        console.log("::::data::::", data);
        delete data.conferences;
        console.log(data);

        const attendeeUrl = 'http://localhost:8001/api/attendees/';
        const fetchConfig = {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const response = await fetch(attendeeUrl, fetchConfig);
        if (response.ok) {
            const newAttendee = await response.json();
            console.log(newAttendee);

            const cleared = {
                name: '',
                email: '',
                conference: '',
            };
            this.setState(cleared)
        };
    };

    async componentDidMount() {
        const url = 'http://localhost:8000/api/conferences/';
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            // console.log("::::data::::", data)

            this.setState({ conferences: data.conferences })
        }
    }

    render() {
        let spinnerClasses = "d-flex justify-content-center mb-3";
        let dropdownClasses = "form-select d-none";
        if (this.state.conferences.length > 0) {
            spinnerClasses = "d-flex justify-content-center mb-3 d-none";
            dropdownClasses = "form-select";
        }

        return (
            <div className="my-5">
                <div className="row">
                    <div className="col col-sm-auto">
                        <img width="300" alt="" className="bg-white rounded shadow d-block mx-auto mb-4" src="/logo.svg" />
                    </div>
                    <div className="col">
                        <div className="card shadow">
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit} id="create-attendee-form">
                                    <h1 className="card-title">It's Conference Time!</h1>
                                    <p className="mb-3">
                                        Please choose which conference
                                        you'd like to attend.
                                    </p>
                                    <div className={spinnerClasses} id="loading-conference-spinner">
                                        <div className="spinner-grow text-secondary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <select onChange={this.handleConferenceSelection} value={this.state.conference} name="conference" id="conference" className={dropdownClasses} required>
                                            <option value="">Choose a conference</option>
                                            {this.state.conferences.map(conference => {
                                                return (
                                                    <option key={conference.href} value={conference.href}>{conference.name}</option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <p className="mb-3">
                                        Now, tell us about yourself.
                                    </p>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-floating mb-3">
                                                <input required onChange={this.handleNameChange} value={this.state.name} placeholder="Your full name" type="text" id="name"
                                                    name="name" className="form-control" />
                                                <label htmlFor="name">Your full name</label>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-floating mb-3">
                                                <input required onChange={this.handleEmailChange} value={this.state.email} placeholder="Your email address" type="email" id="email"
                                                    name="email" className="form-control" />
                                                <label htmlFor="email">Your email address</label>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn btn-lg btn-primary">I'm going!</button>
                                </form>
                                <div className="alert alert-success d-none mb-0" id="success-message">
                                    Congratulations! You're all signed up!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AttendeeSignupForm
