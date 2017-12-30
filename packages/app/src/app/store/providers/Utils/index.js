import { Provider } from 'cerebral';
import { resolveModule } from 'common/sandbox/modules';
import { isEqual } from 'lodash';
import prettify from 'app/utils/prettify';

export default Provider({
  prettify(fileName, code, config) {
    return prettify(fileName, code, config);
  },
  resolveModule,
  isEqual,
  getZip(sandbox) {
    return import(/* webpackChunkName: 'create-zip' */ './create-zip').then(
      module =>
        module
          .getZip(sandbox, sandbox.modules, sandbox.directories)
          .then(result => ({ file: result.file }))
    );
  },
  zipSandbox(sandbox) {
    return import(/* webpackChunkName: 'create-zip' */ './create-zip').then(
      module =>
        module
          .default(sandbox, sandbox.modules, sandbox.directories)
          .then(file => ({ file }))
    );
  },
});