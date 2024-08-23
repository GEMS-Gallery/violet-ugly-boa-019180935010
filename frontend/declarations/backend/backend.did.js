export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'calculate' : IDL.Func(
        [IDL.Text, IDL.Float64, IDL.Float64],
        [IDL.Float64],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
