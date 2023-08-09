const useHandleOnBlur = async (e, validationSchema, setFormErrors) => {
  const { name, value } = e.target;
  const newValue =
    e.target?.type && e?.target?.type === "checkbox" ? checked : value;
  const errors = await validationSchema({ [name]: newValue });
  if (Object.keys(errors).length > 0) {
    setFormErrors((prevState) => ({ ...prevState, [name]: errors[name] }));
    return;
  }
};
export default useHandleOnBlur;
