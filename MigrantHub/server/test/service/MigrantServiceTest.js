var { assert } = require('sinon');
var sinon = require('sinon');
var sinonTest = require('sinon-test');
var test = sinonTest(sinon);
var MigrantService = require('../../service/MigrantService');
var MigrantRepository = require('../../repository/MigrantRepository');
var AccountFactory = require('../factories/AccountFactory');
var chai = require('chai');


describe('migrant service', function () {
  let req = {
    body: AccountFactory.validMigrantAccount(),
    user:{
      _id: "test@test.com"
    },
  };

    it('should call getMigrantUser migrant repository with correct parameters.', test(async function () {
        this.stub(MigrantRepository, 'getMigrantUser');
        await MigrantService.getMigrantUser(req.user._id);
        assert.calledWith(MigrantRepository.getMigrantUser, req.user._id);
    }));

    it('should call editMigrantUser migrant repository with correct parameters.', test(async function () {
        this.stub(MigrantRepository, 'editMigrantUser');
        await MigrantService.editMigrantUser(req.user._id, req.body);
        assert.calledWith(MigrantRepository.editMigrantUser, req.user._id, req.body);
    }));
});