import React from "react";
import PropTypes from "prop-types";

class ScrollToBottom extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }

    render() {
        return this.props.children;
    }
}

ScrollToBottom.propTypes = {
    location: PropTypes.object,
    children: PropTypes.any
};

export default ScrollToBottom;