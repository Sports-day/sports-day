import PropTypes from "prop-types";

export const SDLogo = (props: any) => {
    const {w} = props;
    return (
        <>
            <img src="/logo/logo.svg" alt="logo" height={w*8.45} width={w} />
        </>
    );
};

SDLogo.propTypes = {
    w: PropTypes.object
};
