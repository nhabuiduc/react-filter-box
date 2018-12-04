function requireAll(requireContext) {
    console.log(requireContext.keys());
    return requireContext.keys().map(requireContext);
}

module.exports =
    requireAll(require.context('.', true, /.+spec\.tsx?$/));

