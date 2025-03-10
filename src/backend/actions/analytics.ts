'use server';

import connectDb from '../db/connection';
import Form from '../models/form';
import FormSubmission from '../models/formSubmission';
import { verifyAuth } from '../util';

export const getTotalSubmissionCountAction = async () => {
  try {
    const userId = await verifyAuth();

    await connectDb();

    const formsCreatedByUser = await Form.find({ createdBy: userId }, { id: 1, _id: 0 }).lean();
    const totalSubmissions = await FormSubmission.countDocuments({
      formId: { $in: formsCreatedByUser?.map((form) => form?.id) },
    });

    return {
      success: true,
      data: totalSubmissions || 0,
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return {
      success: false,
      error: error,
    };
  }
};

export const getAverageCompletionRateAction = async () => {
  try {
    const userId = await verifyAuth();

    await connectDb();

    const formsCreatedByUser = await Form.find({ createdBy: userId }, { id: 1, _id: 0 }).lean();

    const [totalSubmissions, completedSubmissions] = await Promise.all([
      FormSubmission.countDocuments({
        formId: { $in: formsCreatedByUser?.map((form) => form?.id) },
      }),
      FormSubmission.countDocuments({
        status: 'completed',
        formId: { $in: formsCreatedByUser?.map((form) => form?.id) },
      }),
    ]);

    const averageCompletionRate = totalSubmissions > 0 ? (completedSubmissions / totalSubmissions) * 100 : 0;

    return {
      success: true,
      data: averageCompletionRate,
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return {
      success: false,
      error: error,
    };
  }
};

export const getMostActiveFormAction = async () => {
  try {
    const userId = await verifyAuth();

    await connectDb();

    const formsCreatedByUser = await Form.find({ createdBy: userId }, { id: 1, _id: 0 }).lean();

    const mostActiveForm = await FormSubmission.aggregate([
      {
        $match: {
          formId: { $in: formsCreatedByUser?.map((form) => form?.id) },
        },
      },
      {
        $group: {
          _id: '$formId',
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: 'forms',
          localField: '_id',
          foreignField: 'id',
          as: 'formDetails',
        },
      },
      {
        $unwind: '$formDetails',
      },
      {
        $project: {
          _id: 0,
          formId: '$_id',
          formName: '$formDetails.name',
          submissions: '$count',
        },
      },
    ]);

    return {
      success: true,
      data: mostActiveForm?.[0]?.formName || 'No forms found',
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return {
      success: false,
      error: error,
    };
  }
};

export const getCompletionRateByFormAction = async () => {
  try {
    const userId = await verifyAuth();

    await connectDb();

    const formsCreatedByUser = await Form.find({ createdBy: userId }, { id: 1, _id: 0, name: 1 }).lean();

    const completionRates = await FormSubmission.aggregate([
      {
        $match: {
          formId: { $in: formsCreatedByUser?.map((form) => form?.id) },
        },
      },
      {
        $group: {
          _id: '$formId',
          totalSubmissions: { $sum: 1 },
          completedSubmissions: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
            },
          },
          completionPercentage: {
            $avg: {
              $cond: [{ $eq: ['$status', 'completed'] }, 100, 0],
            },
          },
        },
      },
    ]);

    const completionRatesWithFormNameList = completionRates?.map((cr) => {
      const form = formsCreatedByUser?.find((form) => form?.id === cr?._id)?.name;
      return {
        formId: cr?._id,
        formName: form,
        completionRate: cr?.completionPercentage,
      };
    });

    return {
      success: true,
      data: completionRatesWithFormNameList || [],
    };
  } catch (error: unknown) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return {
      success: false,
      error: error,
    };
  }
};

export const getFormSubmissionRateOverTimeAction = async () => {
  try {
    const userId = await verifyAuth();

    await connectDb();

    const formsCreatedByUser = await Form.find(
      {
        createdBy: userId,
        createdAt: {
          $gt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        },
      },
      { id: 1, _id: 0 },
    ).lean();

    const formSubmissions = await FormSubmission.aggregate([
      {
        $match: {
          formId: { $in: formsCreatedByUser?.map((form) => form?.id) },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%B',
              date: '$createdAt',
            },
          },
          count: { $sum: 1 },
        },
      },
      // {
      //   // $addFields: {
      //   //   $_id: '$count',
      //   // },
      // },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const formattedData = months?.map((data) => ({
      month: data,
      submissions: formSubmissions?.find((fs) => fs?._id === data)?.count || 0,
    }));

    return {
      success: true,
      data: formattedData || [],
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return {
      success: false,
      error: error,
    };
  }
};
