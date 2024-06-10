import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProfileEntity } from '../../models';
import { IAppQueryString } from '../../shared/interfaces';
import { buildPartialFindOptions } from '../../shared/utils/fns';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { PatchProfileDto } from '../dto/patch-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { LoggedUserModel } from '../models';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(ProfileEntity)
    private readonly Profile: typeof ProfileEntity,
  ) {}

  public find(query: IAppQueryString = {}): Promise<ProfileEntity[]> {
    const { pageSize = 0, pageIndex = 0, filter = {} } = query;

    return this.Profile.findAll({
      ...buildPartialFindOptions<ProfileEntity>({ pageIndex, pageSize }),
      where: {
        ...filter,
      },
      attributes: {
        exclude: ['userId'],
      },
    });
  }

  public findById(id: string): Promise<ProfileEntity | null> {
    return this.Profile.findByPk(id);
  }

  public async count(query: IAppQueryString = {}): Promise<{ count: number }> {
    const { filter } = query;

    const count = await this.Profile.count({
      where: {
        ...filter,
      },
    });

    return { count };
  }

  public create(
    { bio, firstName, lastName }: CreateProfileDto,
    loggedUser: LoggedUserModel,
  ): Promise<ProfileEntity> {
    return this.Profile.create({
      bio,
      firstName,
      lastName,
      userId: loggedUser.id,
    });
  }

  public async overwrite(
    id: string,
    data: UpdateProfileDto,
  ): Promise<ProfileEntity | null> {
    const savedProfile = await this.findById(id);

    if (savedProfile) {
      Object.keys(data).forEach((key) => {
        savedProfile[key] = data[key];
      });

      await savedProfile.save();
    }

    return savedProfile;
  }

  public async update(
    id: string,
    data: PatchProfileDto,
  ): Promise<ProfileEntity | null> {
    const savedProfile = await this.findById(id);

    if (savedProfile) {
      Object.keys(data).forEach((key) => {
        if (data[key] != null) {
          savedProfile[key] = data[key];
        }
      });

      await savedProfile.save();
    }

    return savedProfile;
  }

  public async remove(id: string): Promise<{ deleted: number } | null> {
    const savedProfile = await this.findById(id);

    if (!savedProfile) return savedProfile;

    const deleted = await this.Profile.destroy({ where: { id } });

    return { deleted };
  }
}
