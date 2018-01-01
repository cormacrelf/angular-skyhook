module.exports = {
    removeHyphens: function (str) {
        return (""+str).replace(/^\d+-/i, '').replace(/-/g, ' ');
    },
    unless_eq: function(a, b, opts) {
        if (a != b) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    }
}