import Sequelize from 'sequelize';
import services from '../services';
import models from '../database/models';
import helpers from '../helpers';

const { Op } = Sequelize;

const { reportHelper: { checkForBadWords }, responseMessage } = helpers;

const { Report } = models;

const { novelServices: { findNovel } } = services;

const createReport = async (req, res) => {
  const { slug } = req.params;
  const { type, body } = req.body;
  const { user: { id: userId } } = req;
  let isConfirmed = false;

  try {
    const novel = await findNovel(slug);
    if (!novel) {
      return responseMessage(res, 404, { error: 'novel not found' });
    }
    const { body: novelBody, id: novelId } = novel;
    if (type === 'badWords') {
      isConfirmed = checkForBadWords(novelBody);
    }
    Report.create({
      type, body, userId, novelId, isConfirmed
    });
    return responseMessage(res, 201, { message: 'report was created successfully' });
  } catch (error) {
    responseMessage(res, 500, { error: error.message });
  }
};

const getReports = async (req, res) => {
  const { isHandled } = req.query;
  const reportCondition = isHandled ? { isHandled } : { id: { [Op.ne]: null } };
  try {
    const reports = await Report.findAll({ where: reportCondition });
    responseMessage(res, 200, { data: reports });
  } catch (error) {
    responseMessage(res, 500, { error: error.message });
  }
};

const markAsHandled = async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Report.findByPk(id);
    if (!report) {
      return responseMessage(res, 400, { error: 'report don\'t exist' });
    }
    Report.update({ isHandled: true }, {
      where: { id }
    });
    return responseMessage(res, 200, { message: 'report was mark as Handled successfully' });
  } catch (error) {
    responseMessage(res, 500, { error: error.message });
  }
};

export default {
  createReport,
  getReports,
  markAsHandled
};
